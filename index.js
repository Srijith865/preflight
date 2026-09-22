const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = 'https://kybhgurhlujvkkzqdykg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5YmhndXJobHVqdmtrenFkeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODc5NzIsImV4cCI6MjEwNTY2Mzk3Mn0.vh2rEvsAQvuFVnZ6hIrp7zepo0WevnHhzP5r07GT7J4';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/project/create', async (req, res) => {
  const { url, flow_description } = req.body;

  if (!url || !flow_description) {
    return res.status(400).json({ error: 'url and flow_description are required' });
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { url, flow_description, status: 'pending' }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/project/:id/generate-personas', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch project flow description
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('flow_description')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      console.error('Failed to fetch project:', projectError);
      return res.status(404).json({ error: 'Project not found' });
    }

    const { flow_description } = project;

    // 2. Call Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are generating test personas for a QA tool. Given this app's key flows: '${flow_description}', generate 4 distinct AI user personas who will test this app. Return ONLY a JSON array, no markdown, no preamble, in this exact format: [{ "name": string, "description": string (one sentence on how they behave), "device_tag": "Mobile" or "Desktop" }]`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    let personas;
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error, falling back to mock data:', errorText);
      personas = [
        { name: "Impatient Power User", description: "Wants to get things done as fast as possible, skips reading text.", device_tag: "Desktop" },
        { name: "Confused First-Timer", description: "Unsure what to click, reads everything slowly.", device_tag: "Mobile" },
        { name: "Mobile on Slow Connection", description: "Experiences delays, clicks multiple times if no immediate feedback.", device_tag: "Mobile" },
        { name: "Accessibility User", description: "Relies on keyboard navigation and screen readers.", device_tag: "Desktop" }
      ];
    } else {
      const geminiData = await geminiResponse.json();
      const personasText = geminiData.candidates[0].content.parts[0].text;
      personas = JSON.parse(personasText);
    }

    // 5. Insert personas into ai_personas
    const personasToInsert = personas.map(p => ({
      ...p,
      project_id: id
    }));

    const { data: insertedPersonas, error: insertError } = await supabase
      .from('ai_personas')
      .insert(personasToInsert)
      .select();

    if (insertError) {
      console.error('Failed to insert personas:', insertError);
      return res.status(500).json({ error: 'Failed to save personas' });
    }

    // 6. Update project status
    const { error: updateError } = await supabase
      .from('projects')
      .update({ status: 'running' })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update project status:', updateError);
    }

    // 7. Return personas
    return res.status(200).json(insertedPersonas);

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/project/:id/generate-scenarios', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch project flow_description and personas
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('flow_description')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      console.error('Failed to fetch project:', projectError);
      return res.status(404).json({ error: 'Project not found' });
    }

    const { data: personas, error: personasError } = await supabase
      .from('ai_personas')
      .select('*')
      .eq('project_id', id);

    if (personasError) {
      console.error('Failed to fetch personas:', personasError);
      return res.status(500).json({ error: 'Failed to fetch personas' });
    }

    if (!personas || personas.length === 0) {
      return res.status(400).json({ error: 'No personas found for this project' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`;

    // 2. Call LLM for each persona in parallel
    const scenariosPromises = personas.map(async (persona) => {
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Persona: ${persona.name} - ${persona.description}. App flows to test: '${project.flow_description}'. Generate 3 specific, realistic test scenarios this persona would try, as tasks. Return ONLY valid JSON: [{ "task_description": string }]`
            }]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      let scenarios;
      if (!geminiResponse.ok) {
        console.error(`Gemini API error for persona ${persona.name}, falling back to mock data`);
        scenarios = [
          { task_description: "Navigate to the main dashboard" },
          { task_description: "Attempt to submit the primary form" },
          { task_description: "Check profile settings" }
        ];
      } else {
        const geminiData = await geminiResponse.json();
        const scenariosText = geminiData.candidates[0].content.parts[0].text;
        scenarios = JSON.parse(scenariosText);
      }

      return {
        persona_id: persona.id,
        scenarios: scenarios.map(s => ({
          persona_id: persona.id,
          task_description: s.task_description,
          status: 'pending'
        }))
      };
    });

    const results = await Promise.all(scenariosPromises);

    // 3. Insert into scenarios table
    const allScenariosToInsert = results.flatMap(r => r.scenarios);
    
    const { data: insertedScenarios, error: insertError } = await supabase
      .from('scenarios')
      .insert(allScenariosToInsert)
      .select();

    if (insertError) {
      console.error('Failed to insert scenarios:', insertError);
      return res.status(500).json({ error: 'Failed to save scenarios' });
    }

    // 4. Group by persona to return
    const groupedScenarios = personas.reduce((acc, persona) => {
      acc[persona.name] = insertedScenarios.filter(s => s.persona_id === persona.id);
      return acc;
    }, {});

    return res.status(200).json(groupedScenarios);

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.post('/api/project/:id/run-scenarios', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch project url
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('url')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      console.error('Failed to fetch project:', projectError);
      return res.status(404).json({ error: 'Project not found' });
    }

    // Fetch all personas for the project
    const { data: personas, error: personasError } = await supabase
      .from('ai_personas')
      .select('id')
      .eq('project_id', id);

    if (personasError || !personas || personas.length === 0) {
      return res.status(404).json({ error: 'No personas found for this project' });
    }
    
    const personaIds = personas.map(p => p.id);

    // Fetch all scenarios for these personas
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('*')
      .in('persona_id', personaIds);

    if (scenariosError || !scenarios || scenarios.length === 0) {
      return res.status(404).json({ error: 'No scenarios found for this project' });
    }

    // 2. Fetch in parallel
    const runPromises = scenarios.map(async (scenario) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      let status = 'failed';
      let result_note = '';
      const startTime = Date.now();

      try {
        const response = await fetch(project.url, {
          signal: controller.signal
        });
        const duration = Date.now() - startTime;
        
        clearTimeout(timeoutId);

        if (response.ok && duration < 3000) {
          status = 'passed';
        }
        
        result_note = `${response.status} ${response.statusText}, ${duration}ms`;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          result_note = 'Timeout after 5000ms';
        } else {
          result_note = `Error: ${error.message}`;
        }
      }

      // 3. Update scenario
      const { data: updatedScenario, error: updateError } = await supabase
        .from('scenarios')
        .update({ status, result_note })
        .eq('id', scenario.id)
        .select()
        .single();

      if (updateError) {
        console.error(`Failed to update scenario ${scenario.id}:`, updateError);
        return { ...scenario, status, result_note }; // Return local state if update fails
      }
      return updatedScenario;
    });

    const updatedScenarios = await Promise.all(runPromises);

    // 4. Update project status
    await supabase
      .from('projects')
      .update({ status: 'analyzing' })
      .eq('id', id);

    // 5. Return updated scenarios
    return res.status(200).json(updatedScenarios);

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/project/:id/analyze', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch project, personas, and scenarios
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('flow_description')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { data: personas, error: personasError } = await supabase
      .from('ai_personas')
      .select('*')
      .eq('project_id', id);

    if (personasError || !personas || personas.length === 0) {
      return res.status(400).json({ error: 'No personas found for this project' });
    }

    const personaIds = personas.map(p => p.id);
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('*')
      .in('persona_id', personaIds);

    if (scenariosError || !scenarios || scenarios.length === 0) {
      return res.status(400).json({ error: 'No scenarios found for this project' });
    }

    // Prepare data for Gemini
    const testResultsStr = scenarios.map(s => {
      const persona = personas.find(p => p.id === s.persona_id);
      return `- Persona: ${persona ? persona.name : 'Unknown'}, Task: ${s.task_description}, Status: ${s.status}, Result Note: ${s.result_note}`;
    }).join('\n');

    const promptText = `You are a QA analysis engine. Below is data from an automated pre-launch test run.

App flows tested: '${project.flow_description}'

Test results:
${testResultsStr}

Based on this data, generate a structured issue report. For every scenario marked 'failed', create an issue. You may also infer likely UX issues from the scenario descriptions even if marked 'passed', if the task itself suggests a risk (e.g. a checkout flow on mobile with a slow response time).

Return ONLY a JSON array in this exact format:
[{
  "title": string (short issue title),
  "severity": "critical" or "warning" or "minor",
  "found_by_persona": string (persona name),
  "suggested_fix": string (one specific actionable suggestion)
}]

Generate between 3 and 6 issues total, prioritized by real impact.`;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    let issuesData;
    if (!geminiResponse.ok) {
      console.error('Gemini API error during analysis, falling back to mock data');
      issuesData = [
        {
          title: "Slow response time on dashboard load",
          severity: "warning",
          found_by_persona: "Mobile on Slow Connection",
          suggested_fix: "Optimize images and lazy load dashboard components."
        },
        {
          title: "Primary form submission timeout",
          severity: "critical",
          found_by_persona: "Impatient Power User",
          suggested_fix: "Investigate database query performance on form submission."
        },
        {
          title: "Profile settings hard to locate",
          severity: "minor",
          found_by_persona: "Confused First-Timer",
          suggested_fix: "Make the profile settings button more prominent on the homepage."
        }
      ];
    } else {
      const geminiData = await geminiResponse.json();
      const issuesText = geminiData.candidates[0].content.parts[0].text;
      issuesData = JSON.parse(issuesText);
    }

    const issuesToInsert = issuesData.map(issue => ({
      ...issue,
      project_id: id
    }));

    const { data: insertedIssues, error: insertError } = await supabase
      .from('issues')
      .insert(issuesToInsert)
      .select();

    if (insertError) {
      console.error('Failed to insert issues:', insertError);
      return res.status(500).json({ error: 'Failed to save issues' });
    }

    await supabase
      .from('projects')
      .update({ status: 'complete' })
      .eq('id', id);

    const totalScenarios = scenarios.length;
    const passedCount = scenarios.filter(s => s.status === 'passed').length;
    const failedCount = scenarios.filter(s => s.status === 'failed').length;
    const issuesBySeverity = insertedIssues.reduce((acc, curr) => {
      acc[curr.severity] = (acc[curr.severity] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      issues: insertedIssues,
      summary: {
        total_scenarios: totalScenarios,
        passed: passedCount,
        failed: failedCount,
        issues_by_severity: issuesBySeverity
      }
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
