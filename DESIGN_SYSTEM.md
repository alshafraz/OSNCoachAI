# MathOSN Coach Design System & UI Foundation

This document defines the enterprise-grade Design System that serves as the visual foundation for the entire MathOSN Coach application.

---

## 🎨 Design Principles

1. **Playful but High-Focus (Duolingo + Khan Academy)**: 
   Accents feature child-friendly rounded shapes (`rounded-3xl` and `1.25rem` core radius) and bold 3D button bases (`shadow-play` and `active:translate-y-[4px]`) to maintain high engagement, without distracting from mathematical reasoning.
2. **Accessible High Contrast**: 
   WCAG AA compliance is guaranteed using high-contrast text ratios. Border lines (`border-border`) clearly define component boundaries in both Light and Dark modes.
3. **Reduced Motion Responsive**: 
   All transitions respect browser media settings (`prefers-reduced-motion`) and adapt smoothly from compact mobile viewports to large desktop monitors.

---

## 💎 Design Tokens Reference

Centralized tokens are defined inside the Tailwind v4 `@theme` block in [globals.css](file:///d:/Coding/OSNCoachAI/src/app/globals.css):

### 1. Spacing Scale (4px Vertical Grid)
- **xs / 4**: `0.25rem`
- **sm / 8**: `0.50rem`
- **md / 12**: `0.75rem`
- **lg / 16**: `1.00rem`
- **xl / 20**: `1.25rem`
- **2xl / 24**: `1.50rem`
- **3xl / 32**: `2.00rem`
- **4xl / 40**: `2.50rem`
- **5xl / 48**: `3.00rem`
- **6xl / 64**: `4.00rem`

### 2. Radius Tokens
- **Radius SM**: `calc(var(--radius) * 0.6)`
- **Radius MD**: `calc(var(--radius) * 0.8)`
- **Radius LG**: `1.25rem` (Kid-friendly playful core)
- **Radius XL**: `calc(var(--radius) * 1.4)`
- **Radius 2xl**: `calc(var(--radius) * 1.8)`
- **Radius 3xl**: `calc(var(--radius) * 2.2)`

### 3. Z-Index Registry
- **Popover**: `40`
- **Dialog Overlay / Content**: `50`
- **Toast Notifications**: `50`

---

## 🌈 Semantic & Learning Color Tokens

| Token | Light OKLCH | Dark OKLCH | Purpose |
| :--- | :--- | :--- | :--- |
| `primary` | `oklch(0.50 0.20 260)` | `oklch(0.65 0.18 260)` | Primary Indigo Accent |
| `easy` | `oklch(0.68 0.18 140)` | `oklch(0.72 0.15 140)` | Emerald Green (Easy difficulty) |
| `medium` | `oklch(0.72 0.18 70)` | `oklch(0.75 0.15 70)` | Amber Orange (Medium difficulty) |
| `hard` | `oklch(0.58 0.20 25)` | `oklch(0.65 0.18 25)` | Rose Red (Hard difficulty) |
| `olympiad` | `oklch(0.50 0.20 280)` | `oklch(0.60 0.18 280)` | Deep Violet for main path modules |
| `challenge` | `oklch(0.62 0.18 50)` | `oklch(0.68 0.15 50)` | Golden Yellow for speed challenges |
| `xp` | `oklch(0.62 0.16 220)` | `oklch(0.68 0.14 220)` | Ocean Cyan for points and rewards |
| `ai-coach` | `oklch(0.55 0.18 290)` | `oklch(0.62 0.16 290)` | Magic Purple (AI guidance logs) |
| `locked` | `oklch(0.75 0.01 240)` | `oklch(0.35 0.01 240)` | Grayscale (Locked states) |

---

## 📚 Component Inventory & Folder Structure

All Design System components are located under `src/components/design-system/`:

```
src/components/design-system/
├── BaseUI.tsx       -> Buttons, Cards, Badges, Chips, Avatars
├── Feedback.tsx     -> Modal Dialogs, ToastContainer, Tooltips, Popovers
├── Navigation.tsx   -> Tabs, Accordions, Breadcrumbs, Navbar, Sidebar, Footer
├── Forms.tsx        -> Inputs, Select Dropdowns, Progress, CircularProgress
├── DataDisplay.tsx  -> Tables, Paginations
├── States.tsx       -> Skeletons, EmptyStates, ErrorStates
├── Icon.tsx         -> Lucide icon centralized resolver wrapper
├── Illustration.tsx -> SVG vector illustration placeholders
└── hooks.ts         -> useTheme, useToast, useBreakpoint, useResponsive
```

### Component Imports Examples

```typescript
import { Button, Card, Badge } from '@/components/design-system/BaseUI';
import { useToast, useResponsive } from '@/components/design-system/hooks';
import { Illustration } from '@/components/design-system/Illustration';
import { CircularProgress } from '@/components/design-system/Forms';
import { EmptyState } from '@/components/design-system/States';
```

---

## ♿ Accessibility & WCAG AA Compliance
- **Keyboard Access**: Focusable elements feature visible focus rings (`focus-visible:ring-2`). Modals trap keyboard focuses and block scroll behaviors.
- **ARIA attributes**: Every form input includes helper error labels linked to their values.
- **Grayscale Fading**: Locked achievements use grayscale overrides (`grayscale opacity-55`) so colorblind users immediately identify unlock status without relying on red/green shifts.
