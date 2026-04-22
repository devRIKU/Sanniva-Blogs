---
name: The Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#55423e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#88726d'
  outline-variant: '#dbc1ba'
  surface-tint: '#9a442d'
  primary: '#9a442d'
  on-primary: '#ffffff'
  primary-container: '#e07a5f'
  on-primary-container: '#5b1604'
  inverse-primary: '#ffb4a1'
  secondary: '#9e3f42'
  on-secondary: '#ffffff'
  secondary-container: '#fe8989'
  on-secondary-container: '#762125'
  tertiary: '#386753'
  on-tertiary: '#ffffff'
  tertiary-container: '#70a18a'
  on-tertiary-container: '#003725'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd2'
  primary-fixed-dim: '#ffb4a1'
  on-primary-fixed: '#3c0800'
  on-primary-fixed-variant: '#7c2e19'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b1'
  on-secondary-fixed: '#410007'
  on-secondary-fixed-variant: '#7f282c'
  tertiary-fixed: '#bbeed4'
  tertiary-fixed-dim: '#9fd1b8'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#1f4f3c'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  ui-label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin: 40px
  container-max: 1280px
---

## Brand & Style

The design system is defined by an editorial, high-end aesthetic that bridges the gap between a modern digital utility and a luxury fashion publication. The brand personality is sophisticated, calm, and intentional, targeting an audience that values clarity and premium craftsmanship.

The visual style is a blend of **Minimalism** and **Editorial Modernism**. It utilizes expansive white space, a refined high-contrast typographic hierarchy, and the organic softness of continuous-curve geometry. The result is an interface that feels curated rather than manufactured, evoking a sense of quiet confidence and effortless elegance.

## Colors

The palette is anchored by a breathable, off-white background (#F8F8F8) and absolute black (#000000) for high-contrast typography, ensuring maximum readability and a classic "ink-on-paper" feel. 

The chromatic accents provide warmth and organic depth:
- **Primary (#E07A5F):** A terracotta earth tone used for primary actions and key brand moments.
- **Secondary (#FF8A8A):** A soft, muted coral for highlighting and secondary interactive elements.
- **Tertiary (#81B29A):** A sage green used for success states and naturalistic accents.

The color application should be sparse, allowing the neutral foundations to maintain the luxurious atmosphere.

## Typography

This design system employs a sophisticated tri-font strategy to achieve a "blog-style" editorial hybrid look:

1.  **Display & Headings (Noto Serif):** Used for large headlines to project luxury and authority. The high contrast between thick and thin strokes provides a premium feel.
2.  **Body Text (Newsreader):** A literary serif chosen for long-form readability. It creates a comfortable, intellectual reading experience typical of high-end journals.
3.  **UI & Labels (Inter):** A clean, utilitarian sans-serif used for navigation, buttons, and functional metadata. This ensures the interface remains modern and easy to scan.

Tighten letter-spacing on large display text for a more "locked-in" editorial look, while increasing it for small uppercase labels to improve legibility.

## Elevation & Depth

To maintain the clean, minimalist aesthetic, depth is communicated through **tonal layers** and **subtle transparency** rather than heavy shadows.

- **Surface Levels:** The base layer is #F8F8F8. Elevated containers use #FFFFFF with a very soft, high-diffusion shadow (0px 4px 20px, 4% opacity).
- **Glassmorphism:** For overlays like navigation bars or modals, use a backdrop blur (20px) with a semi-transparent white fill (80% opacity) to create a sense of lightness and physical presence without clutter.
- **Borders:** Use hairline borders (1px) in a light gray or the tertiary sage color to define boundaries where tonal separation is insufficient.

## Shapes

The defining characteristic of this design system's shape language is the **iOS-style squircle**. Unlike standard rounded rectangles, squircles use continuous curvature (G2 curvature) which eliminates the "harsh" point where a straight line meets an arc.

All buttons, cards, and input fields must use these high-roundness continuous curves. This softness balances the sharp, high-contrast serif typography, making the digital experience feel more organic and approachable. Standard UI elements should use `rounded-lg` (16px/1rem) as their baseline to ensure the squircle effect is prominent.

## Components

### Buttons
Buttons should be rendered as prominent squircles. Primary buttons use a solid #E07A5F fill with white Inter Medium text. Secondary buttons use a #000000 fill for high-contrast impact. Tertiary buttons are text-only with a heavy underline that appears on hover.

### Cards & Containers
Containers should use a white background or a very subtle tint of the primary color. The squircle radius should be consistent across all corner points. Ensure internal padding is generous (minimum 32px) to uphold the minimalist philosophy.

### Input Fields
Inputs should be styled as soft-filled squircles (#FFFFFF) with a 1px border that shifts to #E07A5F on focus. Labels should always use Inter (Small/Uppercase) positioned above the field.

### Chips & Tags
Use fully pill-shaped squircles for tags. These should utilize the secondary (#FF8A8A) and tertiary (#81B29A) colors with low-opacity fills and dark text to provide categorization without overwhelming the visual field.

### Navigation
The navigation bar should be a floating squircle container with a backdrop blur, anchored to either the top or bottom of the viewport to feel like a modern OS element.