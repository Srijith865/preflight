---
name: Monochrome Engineering Canvas
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a disciplined, high-density environment engineered for technical workflows, developer platforms, and structured knowledge bases. Taking cues from the clarity of Notion and the precision speed of Linear, the aesthetic is deliberately devoid of chromatic distraction.

### Personality & Tone
- **Hyper-focused & Reductive:** Color never competes with data, code, or architecture. Focus is directed purely through typographic weight, structural division, and micro-contrast.
- **Instrumental & Mechanical:** Every control, border, and surface feels milled and intentional. The interface behaves like calibrated hardware rather than expressive marketing.
- **Keyboard-First Agility:** Dense spatial planning supports fast visual scanning, nested trees, dense tables, and keyboard command workflows without visual clutter.

### Design Movement
A synthesis of **Structural Minimalism** and **Technical Utility**. The interface relies on hairline 1px partitions, crisp geometry, tight typographic tracking, and stark binary contrast between pure `#000000` and `#ffffff` anchored by a calibrated grayscale.

## Colors

The palette is strictly achromatic. There are no hue shifts, temperature biases, or color accents. Visual hierarchy, feedback states, and selection markers rely exclusively on contrast modulation, inverted fills, and hairline borders.

### Palette Tokens
- **Pure Canvas & High Inversion:**
  - `surface-base`: `#ffffff` (Primary app background)
  - `surface-subtle`: `#f9fafb` (Sidebars, table headers, alternating rows)
  - `surface-muted`: `#f3f4f6` (Hover states, chip backgrounds, disabled surfaces)
  - `surface-inverse`: `#000000` (Primary active CTA, tooltip background, badge highlights)
- **Structural Borders:**
  - `border-subtle`: `#f3f4f6` (Dividers within low-contrast areas)
  - `border-default`: `#e5e7eb` (Standard 1px element boundaries, card borders, table cells)
  - `border-strong`: `#111827` (Active input outlines, focused states, prominent partitions)
- **Typographic Tiers:**
  - `text-primary`: `#000000` (Headings, active inputs, primary labels)
  - `text-secondary`: `#111827` (Body copy, high-priority metadata)
  - `text-muted`: `#6b7280` (Secondary labels, breadcrumbs, shortcuts, placeholders)
  - `text-subtle`: `#9ca3af` (Inactive controls, icons in rested states)
  - `text-inverse`: `#ffffff` (Labels over `#000000` or `#111827`)

### State Indicators without Color
- **Selection / Active:** Pure black fill with pure white text, or a 1px solid `#000000` perimeter border.
- **Success / Warning / Destructive:** Expressed via explicit iconography, semantic copy labels (e.g., `[ERROR]`, `[WARN]`), strike-throughs, or filled inverted badges—never through reds or ambers.

## Typography

Typographic scale is compact and dense, tuned for dashboard sidebars, split-pane IDE layouts, and high-frequency content viewing.

### Rules & Hierarchy
- **Primary Typeface:** `Inter` handles all UI labels, body text, and headlines. Negative letter tracking is mandatory from 15px upward to produce a compact, cohesive graphic texture.
- **Monospace Companion:** `JetBrains Mono` is deployed for inline attributes, commit hashes, timestamps, keybindings, and data tables.
- **Micro-Labels:** Use `label-sm` (11px) with uppercase casing and `0.04em` letter-spacing strictly for category headers, table column headers, and status flags.

## Layout & Spacing

The layout model is governed by an absolute 4px base grid, maintaining structured data alignment across multi-column, tool-driven workspaces.

### Viewport & Grid Architecture
- **Desktop Workbench (1280px+):** Collapsible vertical tool rail (48px) paired with a nested secondary navigation sidebar (240px fixed), feeding into a fluid main content canvas with `margin: 1.5rem`.
- **Tablet / Split View (768px - 1279px):** Sidebars collapse into slide-out panels or top command strips. Gutters compress to `0.75rem`.
- **Mobile (320px - 767px):** Single-column stacked layouts, margin drops to `1rem`. Secondary data fields hide behind expandable disclosure drawers.

### Spacing Principles
- **Interior Component Density:** Buttons, inputs, and list rows maintain tight vertical padding (`space-xs` to `space-sm`) paired with moderate horizontal breathing room (`space-md`).
- **Data Densities:** Tables and list views prefer an explicit compact row height of 32px or standard 36px, with no row exceeding 44px in tool views.

## Elevation & Depth

Depth is established via structural perimeter lines and crisp, low-diffusion ambient shadows. Blur is kept tight to prevent the UI from softening or feeling ambient.

### Elevation Levels
- **Layer 0 (Canvas):** `#ffffff` flat background. No shadow.
- **Layer 1 (Cards, Panes, Groups):** `#ffffff` surface with a continuous `1px solid #e5e7eb` boundary.
- **Layer 2 (Dropdowns, Menus, Popovers):** `#ffffff` surface, `1px solid #e5e7eb`, shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`.
- **Layer 3 (Modals, Command Palettes):** `#ffffff` surface, `1px solid #111827`, shadow: `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`. Underlaid with a tinted backdrop overlay of `rgba(0, 0, 0, 0.4)`.

## Shapes

The geometric signature uses tight, crisp corner curves: 4px default for inputs, badges, and buttons; 6px for dialogs, cards, and modal canvases. Fully circular or pill radiuses are forbidden to maintain an exacting, technical appearance.

### Shape Assignment
- **Micro / Nested Elements (4px):** Badges, keyboard shortcut tags (`<kbd>`), inner list selection states, checkboxes, text inputs, buttons.
- **Macro Containers (6px):** Command palettes, flyouts, floating panels, code blocks.
- **Dividers & Separators:** 0px radius, 1px uniform height/width hairline cuts.

## Components

### Buttons
- **Primary:** Solid `#000000` background, `#ffffff` text, 4px corner radius. Hover shifts to `#111827`. Active state applies `transform: scale(0.99)`.
- **Secondary / Outline:** `#ffffff` background, `1px solid #e5e7eb` border, `#111827` text. Hover shifts background to `#f9fafb` and border to `#9ca3af`.
- **Ghost:** Transparent background, `#6b7280` text. Hover shifts to `#f3f4f6` background and `#000000` text.
- **Size Specs:** Height of 32px for default actions (8px vertical padding, 12px horizontal); 28px for compact actions.

### Badges & Status Chips
- **Neutral / Meta:** `#f3f4f6` fill, `#111827` text, no border, 4px radius, `label-sm` font.
- **Inverted / Selected:** `#000000` fill, `#ffffff` text, 4px radius.
- **Outline Status:** `#ffffff` fill, `1px solid #e5e7eb` border, `#6b7280` text. Never uses colored dots; relies on typographic notation (e.g., `● ACTIVE`, `○ IDLE`).

### Lists & Navigation Trees
- **Items:** 30px to 32px height, 6px horizontal padding.
- **Hover State:** Background `#f9fafb` with `#000000` text.
- **Selected State:** Background `#f3f4f6` with `#000000` font weight stepped to `500`. Includes a 2px vertical indicator bar in `#000000` anchored to the immediate left border.

### Checkboxes & Radios
- **Unchecked:** `#ffffff` canvas with `1px solid #9ca3af` border, 3px corner radius (checkbox) or circle (radio).
- **Checked:** Pure `#000000` fill with `#ffffff` check icon or dot. Focus rings render as a crisp `2px solid #000000` offset by 2px white space.

### Form Input Fields
- **Container:** `#ffffff` canvas, `1px solid #e5e7eb` border, 4px radius, 32px height, 13px typography.
- **Placeholder:** `#9ca3af`.
- **Hover:** Border shifts to `#9ca3af`.
- **Focus:** Border transitions instantly to `1px solid #000000`, reinforced with a `1px` outer shadow ring of `#000000`.

### Cards & Grouping Panes
- **Framing:** `#ffffff` fill, `1px solid #e5e7eb`, 6px corner radius.
- **Header:** Delimited by a bottom `1px solid #e5e7eb` hairline divider, utilizing `surface-subtle` (`#f9fafb`) for table headers or metadata strips.

### Additional Tooling Components
- **Command Palette (`Cmd + K`):** Centered floating dialog, 640px fixed width, 6px radius, `1px solid #111827`. Direct search input decoupled from border lines via generous padding. Results categorized under uppercase `label-sm` subheadings.
- **KBD Shortcut Tags:** Monospace `JetBrains Mono` at 11px, `#ffffff` background, `1px solid #e5e7eb` border with a subtle bottom edge weight of `1px solid #9ca3af`, 3px radius, 2px horizontal padding.