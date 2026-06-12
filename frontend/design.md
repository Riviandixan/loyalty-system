---
name: Sahabat Retail
colors:
  surface: '#fff8f6'
  surface-dim: '#ebd6cf'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#ffe9e3'
  surface-container-high: '#fae4dd'
  surface-container-highest: '#f4ded7'
  on-surface: '#241915'
  on-surface-variant: '#57423b'
  inverse-surface: '#3a2e29'
  inverse-on-surface: '#ffede8'
  outline: '#8b7169'
  outline-variant: '#dec0b6'
  surface-tint: '#a43c12'
  primary: '#a43c12'
  on-primary: '#ffffff'
  primary-container: '#ff7f50'
  on-primary-container: '#6c2000'
  inverse-primary: '#ffb59c'
  secondary: '#006a65'
  on-secondary: '#ffffff'
  secondary-container: '#76f3ea'
  on-secondary-container: '#006f69'
  tertiary: '#8d4f11'
  on-tertiary: '#ffffff'
  tertiary-container: '#df9350'
  on-tertiary-container: '#5b2f00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#380c00'
  on-primary-fixed-variant: '#822800'
  secondary-fixed: '#79f6ed'
  secondary-fixed-dim: '#59dad1'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504c'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fff8f6'
  on-background: '#241915'
  surface-variant: '#f4ded7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 32px
  gutter: 24px
  card-gap: 24px
  section-margin: 48px
---

## Brand & Style

The design system is built to feel like a helpful friend rather than a management tool. It targets small-to-medium retail owners who value personal connection with their customers. The aesthetic is "Human-Centric Playful"—it moves away from cold, industrial SaaS norms toward a warm, tactile, and approachable interface.

The design style blends **Minimalism** with **Soft-Tactile** elements. By using a warm base palette and "squishy" high-radius corners, the UI feels safe and inviting. Interaction is key; the interface should feel responsive and bouncy, using casual Indonesian copy to foster a sense of community and ease.

## Colors

This design system utilizes a "Sunshine & Earth" palette. We strictly avoid corporate blues to ensure the product feels distinct in the retail tech space.

- **Primary (Coral):** Used for main actions, active states, and highlighting key achievements. It brings energy and warmth.
- **Secondary (Teal):** Used for growth metrics, success states, and secondary navigational elements. It balances the heat of the coral.
- **Tertiary (Muted Orange):** Reserved for accents, warning states, or softer decorative elements.
- **Background (Warm Cream):** Instead of pure white, we use `#FCFBF8` to reduce eye strain and reinforce the "organic" feel.
- **Neutral:** A deep, warm charcoal (`#4A4543`) is used for text instead of pure black to maintain the soft visual contrast.

## Typography

We use **Plus Jakarta Sans** across all roles to maintain a cohesive, modern, and rounded look. The font's open counters and friendly geometry perfectly align with the "human-centric" goal.

Headlines should be bold and confident, especially when displaying big numbers like "Total Poin." For smaller labels, we maintain a slightly higher font weight (`600`) to ensure legibility against the soft background. Always keep line heights generous to allow the text to "breathe."

## Layout & Spacing

The layout follows a **Fluid Grid** with generous internal breathing room. 

- **Desktop:** 12-column grid with a maximum container width of 1440px. 24px gutters and 32px side margins.
- **Mobile:** Single column with 16px side margins. 
- **Spacing Rhythm:** Use a base-8 scale. For card interiors, use 24px or 32px padding to maintain the "airy" feel. Avoid tight clusters of information; if in doubt, add more whitespace.

## Elevation & Depth

Depth is created through **Ambient Shadows** rather than lines. We avoid harsh borders.

- **Floating Cards:** All main dashboard cards use a thick, extra-diffused shadow (`0 20px 40px rgba(74, 69, 67, 0.08)`).
- **Layering:** The background is the lowest level. Cards sit on top. Modals and pop-overs sit on a higher plane with even deeper, softer shadows.
- **Interactive Depth:** On hover, cards should lift slightly using `translate-y(-4px)` and the shadow should become slightly more pronounced to simulate physical movement.

## Shapes

The shape language is extremely soft. We use a **32px (rounded-3xl)** base for all main containers and cards. 

- **Buttons & Progress Bars:** Use "Pill" shapes (rounded-full) to maximize the friendly, approachable feel.
- **Icons:** Should always be rounded-corner icons, never sharp or jagged styles.

## Components

### Buttons
Primary buttons use the Coral background with white text and a pill-shape. They should have a subtle "press-in" effect on click. Secondary buttons use a Teal outline or a soft Teal tint.

### Cards
Cards are the hero of this system. They must have a white background, 32px border-radius, and the signature "floating" shadow. 
- **Hover State:** `transform: translateY(-8px);` with an increased shadow spread.
- **Content:** Always include an icon or emoji in the top right for a splash of personality.

### Progress Bars
Fully rounded (pill-shaped) tracks. Use a high-contrast color for the fill (Teal or Coral) against a very light version of the same hue for the track background.

### Input Fields
Fields should have a light cream border that darkens/thickens on focus. Use 16px border-radius for inputs to maintain the rounded theme without making them full pills (which can sometimes hide text).

### Copywriting & Tone
Use casual Indonesian. 
- *Example:* Instead of "Selamat Datang," use "Halo lagi, Juragan! 👋"
- *Example:* Instead of "Data Tersimpan," use "Mantap! Perubahanmu sudah aman. ✅"