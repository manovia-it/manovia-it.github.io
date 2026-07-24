---
name: MANÓVIA
description: Marketing site for a study-in-Italy consultancy — university admission, DSU scholarship, and residence-permit guidance for CIS students.
colors:
  ink: "#0F0F0F"
  paper: "#FFFFFF"
  terra: "#E2725B"
  terra-deep: "#C25940"
  stone: "#6E6E6E"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(44px, 8vw, 96px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(32px, 5vw, 56px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  stat:
    fontFamily: "Piazzolla, Georgia, serif"
    fontSize: "clamp(64px, 14vw, 160px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.1em"
rounded:
  btn: "0px"
components:
  button-primary:
    backgroundColor: "{colors.terra}"
    textColor: "{colors.paper}"
    rounded: "{rounded.btn}"
    padding: "0 32px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.terra-deep}"
---

# Design System: MANÓVIA

## 1. Overview

**Creative North Star: "Luxury Brutalism"**

MANÓVIA's visual system is a strict monochrome (true black `#0F0F0F` / true white `#FFFFFF`, no warm tint) with exactly one accent — a coral terracotta (`#E2725B`) — used only where something needs to act or matter: buttons, prices, hairline dividers, one highlighted phrase per heading. Corners are square everywhere (`border-radius: 0`). A bold grotesk (Archivo, 700-900) carries every headline at dramatic scale; a refined serif (Piazzolla) is reserved specifically for numerals and fine detail (prices, the DSU stat) per the client's explicit spec — a considered pairing, not an accident. A single verified, high-contrast black-and-white architectural photograph (Florence Cathedral's stone stairwell — hard shadows, no people, no signage) anchors the hero.

This is the third major direction in this project's history. Two earlier directions were tried and rejected (a photographic serif/sans "Consulate Stamp" version; a fully restrained small-type "businesslike" version). A fourth, "bold editorial monochrome" direction was accepted, then the client escalated it twice further via two increasingly detailed copywriting/design briefs modeled on an elite luxury agency — see PRODUCT.md for the full positioning history and the two factual guardrails (DSU/ISEE eligibility, legal/contract facts) that survive every iteration regardless of tone requests.

**Key Characteristics:**
- True monochrome (`#0F0F0F` / `#FFFFFF`) — no warm-tinted neutral anywhere, a harder read than the previous ink/paper pairing
- Terracotta shifted to a brighter coral (`#E2725B`, was `#B0502F`) — client-specified exact hex, the system's only color
- Square corners everywhere (`border-radius: 0`) — no exceptions
- Archivo (grotesk, 700-900) for headlines; Piazzolla (serif, 500-600) specifically for numerals/prices/stats; Public Sans for body copy — a deliberate three-role type system, not scale-contrast-within-one-family
- Massive **outline** numerals (`-webkit-text-stroke`, transparent fill) behind the 7-step process, overlapping the step text — a specific client-specified effect, distinct from the earlier solid-terracotta step numerals
- Pricing table is now full-width stacked rows separated by terracotta hairlines, with a hover state that inverts the row to a solid-ink background — not a 3-column card grid
- The manifesto/filter section ("who we don't work with") is muted (50% opacity) at rest and brightens to full opacity on hover per item — the emphasis is earned by attention, not given for free
- Real photography is back (hero only) — a considered reversal of an earlier "no photography" decision; see PRODUCT.md before removing it again

## 2. Colors

True monochrome + exactly one accent. No warm tint anywhere now — this is colder and starker than the previous ink/paper pairing on purpose.

### Primary
- **Terracotta** (`#E2725B` / `--terra`): the only color that signals "act here" — buttons, hairline dividers in the pricing table, the highlighted phrase in the hero H1, prices, step-numeral outlines, DSU stat figure.
- **Terracotta Deep** (`#C25940` / `--terra-d`): button hover state only.

### Monochrome
- **Ink** (`#0F0F0F` / `--ink`): true near-black; primary text on white sections, solid background for inverted sections.
- **Paper** (`#FFFFFF` / `--paper`): true white; default background, text color on ink sections.
- **Stone** (`#6E6E6E` / `--stone`): muted secondary text on paper; a lighter `--stone-on-ink` (`#9A9A9A`) holds contrast on ink backgrounds.

### Named Rules
**The One-Accent Rule.** Terracotta is the only color that does active work. No second accent color, ever.

**The True-Monochrome Rule.** Backgrounds are `#0F0F0F` or `#FFFFFF` exactly — no warm or cool tint on either. This is colder and more graphic than the earlier "ink/paper" pairing on purpose; don't soften it back toward a warm off-white.

## 3. Typography

Three deliberate roles, not one family at different sizes:

- **Archivo** (700/800/900): every headline, section title, step/card title. Bold, wide, confident grotesk.
- **Piazzolla** (500/600, serif): reserved *specifically* for numerals and fine detail — package prices, the DSU stat figure, the outline step numerals. This pairing (aggressive grotesk headlines + refined serif numerals) is a specific client spec, not a stylistic accident; don't let the serif leak into headlines or the grotesk leak into prices.
- **Public Sans** (400/700): all running body copy and small labels.

### Hierarchy
- **Display** (Archivo 900, `clamp(44px, 8vw, 96px)`, line-height 0.98, letter-spacing -0.03em): hero H1. One phrase inside it is set in terracotta via `<em>` (styled non-italic).
- **Stat** (Piazzolla 600, `clamp(64px, 14vw, 160px)`, line-height 0.9): the DSU figure and the massive outline step numerals (stroke-only, transparent fill, `-webkit-text-stroke: 1.5px var(--terra)`).
- **Headline** (Archivo 800, `clamp(32px, 5vw, 56px)`): section `h2`s.
- **Title** (Archivo 700, 16-18px): card/step/FAQ titles.
- **Body** (Public Sans 400, 17px): running copy.
- **Label** (Public Sans 700, 12px, letter-spacing 0.1em, uppercase): eyebrow, footer columns.

### Named Rules
**The Grotesk/Serif Split Rule.** Headlines are always Archivo. Numerals with weight (prices, stats, the step outline numbers) are always Piazzolla. Never swap the two — the contrast between an aggressive grotesk and a refined serif numeral is the specific effect requested, and collapsing to one family loses it.

## 4. Elevation & Shape

Flat and square. No shadows anywhere, no rounded corners anywhere (`--r-btn: 0`). The only "surface" distinctions are: a hairline border (`var(--rule)` / `var(--rule-terra)`) and a full background-color inversion on hover (pricing rows) or an opacity change on hover (filter/manifesto items).

### Named Rules
**The No-Curve Rule.** `border-radius: 0` on every element without exception — buttons, any future card, any future input. A rounded corner anywhere reads as a regression to a softer, less brutalist system.

**The Invert-on-Hover Rule.** Pricing rows don't lift or gain a shadow on hover — the whole row's background flips to solid ink, text recolors to paper, price stays terracotta. This is the system's one hover-interaction language for "this row has your attention now."

## 5. Components

### Buttons
Square corners, 54px height, terracotta fill/paper text. One button style used everywhere — every CTA on the page is visually identical, which is deliberate.

### Hero (photographic)
Real, verified black-and-white architectural photography (currently: Florence Cathedral's stone stairwell) fills the viewport, `grayscale(1) contrast(1.15)` applied for a harder, grainier look, with a bottom-weighted `rgba(15,15,15,...)` scrim for text legibility. Content sits bottom-left, asymmetric. Any future hero photo must be verified real (not a guessed URL), free of signage/people/political content, and read as architectural/geometric rather than a travel postcard.

### Steps (outline numerals)
Each step is a `position: relative` row with a massive (`clamp(90px, 15vw, 180px)`) Piazzolla numeral positioned absolutely behind the text, rendered as an outline only (`color: transparent; -webkit-text-stroke: 1.5px var(--terra)`), overlapping into the row below. The step title/text sit in a `position: relative` body block offset to the right of the numeral. This is the specific "massive contour numbers, overlapping small strict text" effect from the client's brief.

### Pricing Table (full-width rows)
Not a card grid: each tier is a full-width row separated by a terracotta-tinted hairline (`var(--rule-terra)`), with label/price on the left, description/checklist in the middle, and the CTA button on the right (stacks on mobile). Hovering a row inverts its background to ink and recolors its text to paper; the price stays terracotta throughout. The recommended tier gets a small terracotta label above its name — no scaled-up size, no decorative badge.

### Manifesto/Filter (hover-reveal)
The "who we don't work with" section's items sit at 50% opacity by default and brighten to 100% on hover (`#filter .ed-item`, scoped so it doesn't affect the same `.ed-item` component used elsewhere if reused). This is the "muted until you engage" effect from the client's brief — don't apply it to any other `.ed-item` usage without the same scoping.

### FAQ Accordion
Flat list, hairline divider, Archivo question text. Unchanged since the minimal-system pass.

## 6. Do's and Don'ts

### Do:
- **Do** keep terracotta as the only accent color, per the One-Accent Rule.
- **Do** keep true `#0F0F0F`/`#FFFFFF` monochrome — no warm tint, per the True-Monochrome Rule.
- **Do** keep `border-radius: 0` everywhere, per the No-Curve Rule.
- **Do** keep Archivo for headlines and Piazzolla for numerals/stats — never swap, per the Grotesk/Serif Split Rule.
- **Do** keep pricing rows full-width and stacked, inverting on hover — not a card grid.
- **Do** keep the manifesto/filter section muted-until-hover.
- **Do** verify any photograph is real, clean (no people/signage/political content), and architectural/geometric in mood before using it.
- **Do** keep package prices unchanged (€3,000/4,000/5,000) and the DSU/ISEE eligibility mechanic visible somewhere in the Smart Money copy — see PRODUCT.md's non-negotiable guardrails.

### Don't:
- **Don't** add a second accent color, ever.
- **Don't** add any rounded corner, anywhere.
- **Don't** let Piazzolla leak into headlines or Archivo leak into prices/stats.
- **Don't** add shadows — inversion-on-hover and opacity-on-hover are the only interaction states in the system.
- **Don't** reintroduce the earlier ink/paper (warm off-white) palette — this system is colder on purpose.
- **Don't** remove the hero photography without checking PRODUCT.md first — this has been added and removed twice already in this project's history.
