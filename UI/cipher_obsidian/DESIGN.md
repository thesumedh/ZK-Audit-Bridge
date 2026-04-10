# Design System Document: Cryptographic Clarity

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Invisible Vault."** 

This system represents the intersection of impenetrable security and absolute technical transparency. We are moving away from the "clunky dashboard" aesthetic of traditional fintech. Instead, we embrace a high-end editorial approach that mirrors the elegance of a Zero-Knowledge proof: complex on the inside, but deceptively simple and beautiful on the surface.

To break the "template" look, we utilize:
*   **Intentional Asymmetry:** Aligning technical data to a rigid grid while allowing hero elements and "proof" visualizations to break the container bounds.
*   **Atmospheric Depth:** Using the deep "Midnight" palette not just as a background, but as a volumetric space where information floats and recedes.
*   **High-Contrast Scale:** Using dramatic shifts between `display-lg` typography and technical `label-sm` data points to create an authoritative, sophisticated hierarchy.

---

## 2. Colors & Surface Philosophy

The palette is designed to feel like a high-end terminal viewed through a lens of obsidian glass.

### Color Tokens
*   **Primary (`#e1fdff` / `#00f2ff`):** The "Cryptographic Cyan." Used for active proofs and high-signal data.
*   **Secondary (`#dcb8ff` / `#7701d0`):** The "Intelligence Purple." Reserved for AI-driven insights and automated compliance logic.
*   **Surface Hierarchy:**
    *   `surface-container-lowest` (#0b0e14): The base layer of the application.
    *   `surface-container-low` (#191c22): Primary section backgrounds.
    *   `surface-container-highest` (#32353c): Floating interactive elements.

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** 
Visual boundaries must be defined solely through background shifts. To separate a navigation rail from a main feed, transition from `surface-container-low` to `surface`. If a card needs to stand out, it should sit as `surface-container-lowest` on top of a `surface-container-low` background. This creates a "molded" look rather than a "boxed" look.

### The Glass & Gradient Rule
To achieve a premium "ZK" feel, use **Glassmorphism** for floating overlays. Use a semi-transparent `surface-variant` with a `20px` backdrop-blur. For main CTAs, apply a linear gradient from `primary` to `primary-fixed-dim` at a 135-degree angle to provide a sense of luminous energy.

---

### 3. Typography

Precision is our primary brand value. We pair the geometric stability of **Space Grotesk** with the utilitarian clarity of **Inter**.

*   **Display & Headlines (Space Grotesk):** Used for large data summaries and editorial section titles. The wide tracking and geometric forms convey a sense of "Tech-High-Fashion."
*   **Titles & Body (Inter):** The workhorse for all data entry and descriptive text. It is neutral, legible, and evokes professional reliability.
*   **Labels & Mono (Inter):** For cryptographic hashes and ZK-proof strings, utilize Inter with increased letter spacing or a monospace fallback to ensure every character is distinct and deliberate.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than shadows.

*   **The Layering Principle:** Treat the UI as stacked sheets of dark glass. 
    *   *Level 0:* `surface-container-lowest` (The Void)
    *   *Level 1:* `surface-container-low` (The Workspace)
    *   *Level 2:* `surface-container-high` (Interactive Cards)
*   **Ambient Shadows:** If an element must float (e.g., a modal), use a shadow with a `40px` blur at `8%` opacity. The shadow color must be tinted with `primary` (#00f2ff) to simulate the glow of the data underneath.
*   **The "Ghost Border" Fallback:** For input fields or mandatory accessibility containers, use the `outline-variant` token at **15% opacity**. This creates a suggestion of a container without disrupting the "No-Line" philosophy.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), black text (`on-primary`), `md` (0.375rem) roundedness.
*   **Secondary:** Glass-style. Background `surface-variant` at 20% opacity with a `primary` ghost border (15%). 
*   **Tertiary:** Text-only in `primary-fixed-dim`, uppercase, with `label-md` styling.

### Chips (Proof Indicators)
*   **Validated Proofs:** A subtle `primary` glow (outer glow, 4px spread) with `on-primary-container` text.
*   **Encrypted Data:** `surface-container-highest` background with a "shimmer" animation to indicate hidden state.

### Input Fields
*   **Style:** Minimalist. No bottom line, no full border. Use `surface-container-high` as a solid block background. 
*   **States:** On focus, the background remains, but a 1px "Ghost Border" of `primary` appears at 40% opacity.

### Cards & Lists
*   **Prohibition:** No divider lines between list items. Use `16px` of vertical whitespace (Gap) and a subtle hover state shift to `surface-bright`.
*   **The "ZK-Status" Sidebar:** A component specific to this system that sits on the right of cards, using a 2px vertical accent of `secondary` (Purple) to indicate AI-verified compliance.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a structural element. If you think you need a line, you probably need 24px more padding.
*   **DO** use "Electric Purple" (`secondary`) sparingly to highlight AI-augmented features.
*   **DO** ensure all "Validated" states have a subtle `primary` glow to signify a successful ZK-proof.

### Don't
*   **DON'T** use 100% opaque white text. Use `on-surface-variant` for secondary text to maintain the "Midnight" atmosphere.
*   **DON'T** use standard "Success Green" or "Warning Orange." Map all status indicators to the `primary` (Valid), `secondary` (Processing), and `error` (Invalid) tokens.
*   **DON'T** use sharp 90-degree corners. Stick to the `md` (0.375rem) roundedness scale to keep the tech feeling "intelligent" and "organic."