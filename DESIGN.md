# Design Brief

## Purpose & Tone
Professional, approachable small-business billing interface for cup sambarani. Warm, honest, unhurried aesthetic. Crafted yet refined—avoiding both cold corporate and generic SaaS clichés. Every interaction is deliberate.

## Color Palette (OKLCH)

| Token | Light L | Light C | H | Dark L | Dark C | Use |
|-------|---------|---------|---|--------|--------|-----|
| Primary (Saffron) | 0.68 | 0.15 | 70 | 0.73 | 0.16 | CTAs, headers, active states |
| Secondary (Taupe) | 0.75 | 0.05 | 60 | 0.28 | 0.02 | Navigation, supporting UI |
| Accent (Burnt Sienna) | 0.55 | 0.14 | 25 | 0.62 | 0.15 | Highlights, emphasis, invoice accent |
| Neutral (Warm Cream) | 0.98 | 0.01 | 60 | 0.15 | 0.01 | Backgrounds, text |
| Background | 0.98 | 0.01 | 60 | 0.15 | 0.01 | Page canvas |
| Foreground | 0.15 | 0.01 | 60 | 0.92 | 0.01 | Body text, content |

## Typography
- **Display:** Fraunces (serif, editorial). Page titles, invoice headers, section callouts. 32–48px scale.
- **Body:** GeneralSans (humanist sans, warm). Form labels, content, data tables, guidance. 14–16px.
- **Mono:** JetBrainsMono (fixed-width). Product codes, invoice totals, pricing breakdowns. 12–13px.

## Structural Zones

| Zone | Background | Treatment | Purpose |
|------|-----------|-----------|---------|
| Header | Card (0.99 L) | Visible border-b, warm shadow | Branding, navigation, invoice title |
| Form Section | Background (0.98 L) | Subtle muted border | Billable content area |
| Card | Card (0.99 L) | Warm shadow, 8px radius | Product list, bill history, sections |
| Footer | Muted (0.92 L) | Border-t, neutral | Totals row, GST breakdown, export button |
| Success Accent | Accent (Sienna) | Highlight or dot | Active bill, submitted state |

## Component Patterns
- **Buttons:** Primary (saffron bg, serif label); Secondary (taupe outline). All caps labels via font-feature-settings.
- **Forms:** Clear label hierarchy, single-line fields with warm input borders. Hover state: +1% lightness, +0.01 chroma.
- **Dropdowns:** Custom select with warm focus ring (6px spread). Icon-led product selection.
- **Tables:** Alternating row backgrounds (primary/muted). Serif headers. Mono pricing values.
- **Cards:** 8px radius, warm shadow, visible border. Product preview, bill summary.

## Elevation & Depth
- **Shadows:** Subtle, warm-tinted (8% opacity blacks). No harsh drop shadows.
- **Layers:** Card > popover > dialog. Warm background beneath all overlays.
- **Focus rings:** 3px saffron ring, 6px spread. Accessible AA+ contrast in all modes.

## Spacing & Rhythm
- **Base:** 8px system. Density clusters: form fields 8px apart, section gutters 24px.
- **Breathing room:** Hero section top margin 32px, invoice content padding 24px.
- **Responsive:** Stack vertically at `sm:`, two-column at `md:`, full grid at `lg:`.

## Motion & Interaction
- **Transition:** 300ms cubic-bezier(0.4, 0, 0.2, 1) for all interactive elements.
- **Focus states:** Ring + scale (1.02x) on buttons.
- **Loading:** Subtle pulse on async actions. No spinners.
- **Bill export:** Quick fade-out success toast, no splash animation.

## Constraints
- **No dark mode:** Light theme only (warm cream primary, charcoal text). Reduces cognitive load for bill references.
- **Max colors:** 5 (primary, secondary, accent, neutral, destructive). Charts use primary + accent variants.
- **Typeface mix:** Serif + humanist sans creates premium feel; no system fonts.
- **Consistency:** All dropdowns, all tables, all forms use same component language.

## Signature Detail
**Warm earthy palette + serif display typography:** Differentiates from blue-button SaaS dashboards. The Fraunces serif headers paired with saffron buttons and burnt-sienna accents create an artisanal, quality-focused aesthetic appropriate for traditional products like cup sambarani. Warm shadows and cream backgrounds provide approachability while serif typography signals refinement and trust.
