# MathOSN Coach Motion Design & Micro-interactions

This document outlines the visual choreography, duration tokens, accessibility overrides, and future audio integration plans for the **MathOSN Coach** design system.

---

## 🏎️ Motion Tokens

Centralized duration speeds and easing variables are exported from [motion.tsx](file:///d:/Coding/OSNCoachAI/src/components/design-system/motion.tsx):

### 1. Duration Tokens
- **Fast (`0.15s`)**: Used for micro-interactions, checkbox toggles, and button taps.
- **Normal (`0.30s`)**: Used for page navigation transitions, toast alerts, and layout staggers.
- **Slow (`0.50s`)**: Used for deep dashboard widgets loading or achievement locks breaking.

### 2. Easing & Curves
- **Ease In / Out**: Standard cubic-bezier curves matching hardware accelerators.
- **Bounce (`[0.175, 0.885, 0.32, 1.275]`)**: A kid-friendly bounce curve (used for modal popups and achievement reveals).
- **Spring (`stiffness: 300, damping: 20`)**: Organic spring physics for list staggers.
- **Elastic (`stiffness: 450, damping: 12`)**: Energetic bounces for unlocking events.

---

## 🧬 Animation & Interaction Inventory

We categorized motion behaviors to keep layout loads stable and avoid expensive repaints:

### 1. Micro-interactions
- **Hover Lift (`hoverLift`)**: Translates items `-4px` upward on mouse hovers.
- **Hover Glow (`hoverGlow`)**: Adds a primary glow shadow boundary around cards.
- **Card Tilt (`cardTilt`)**: Applies a subtle `0.5deg` rotation to card elements.
- **Icon Bounce (`iconBounce`)**: Endless looping up/down animations (used for streak fires or level badges).
- **Icon Rotate (`iconRotate`)**: Springs Lucide icons `20deg` rightward on hovers.

### 2. Page & Feedback Loops
- **Page Transitions**: Fades and translates route wrappers smoothly.
- **Toast Slide In**: Translates alerts from bottom-right into visibility.
- **Modal Scale**: Zooms overlays using bounce curves.
- **Typing Indicator**: Pulses loading dots for active AI Coach thoughts.
- **XP progress fills**: Smoothly shifts progress bars using GPU layout variables.

---

## ♿ Reduced Motion Accessibility

To fulfill WCAG AA guidelines, animations are designed to degrade gracefully if a student's operating system has toggled the **Reduce Motion** setting.

In Framer Motion, this is supported globally by wrapping animators or calling `useReducedMotion` to substitute slide/scale coordinates with simple opacity fade curves:
```typescript
import { useReducedMotion } from 'framer-motion';

const shouldReduce = useReducedMotion();
const transitionY = shouldReduce ? 0 : 12; // Disables physical shifts
```
This is fully compatible with tailwind-animate standard definitions.

---

## 🔊 Sound Event Interfaces & Future Strategy

We implemented a unified, interface-only event controller `soundManager` to trigger sound effects programmatically.

### Sound Controller Interface
```typescript
export interface SoundController {
  playEvent(event: 'click' | 'correct' | 'wrong' | 'xp' | 'achievement' | 'mission'): void;
}
```

### Future Integration Blueprint
1. **Audio Pre-loading**:
   - Audio files (e.g. `.mp3` or `.ogg` sound bites under 25KB) will be placed in `public/sounds/`.
   - We will lazily load sounds upon student logins using the Web Audio API to prevent high initial payload overheads.
2. **Settings Controls**:
   - The toggles inside the student settings page (`StudentSettingsForm`) write sound preference values to local storage.
   - The concrete implementation of `SoundController` will verify `localStorage.getItem('sounds-enabled') === 'true'` before instantiating or executing `AudioContext.play()`.
3. **Sound-Motion Synchronization**:
   - Sound triggers execute at the exact frame animation begins (e.g., calling `soundManager.playEvent('correct')` in parallel with triggering `canvas-confetti`).
