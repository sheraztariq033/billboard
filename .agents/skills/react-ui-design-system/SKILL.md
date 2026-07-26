---
name: react-ui-design-system
description: Guidelines, design tokens, micro-animations, glassmorphism, dynamic color palettes, Radix/Shadcn UI component composition, Lucide icons, and responsive mobile-first visual styling for React web applications.
---

# React UI & Mobile-First Design System Skill

This skill provides modern design patterns and visual styling guidelines for crafting world-class, premium React user interfaces across mobile PWAs and desktop applications.

## Design System Principles

1. **Vibrant & Tailored Palette**: Avoid plain browser defaults (pure red, green, blue). Use curated HSL or CSS variable color palettes with deep dark modes (`#090d16`, `#0f172a`), sleek gradients, and subtle borders.
2. **Glassmorphism & Surface Elevation**: Combine subtle backdrops (`backdrop-blur-md`), translucent backgrounds (`rgba(255, 255, 255, 0.05)` or `bg-slate-900/60`), and fine border lines (`border-slate-800/80`).
3. **Responsive Mobile Touch Targets**: On mobile PWA screens, ensure buttons and interactive controls have minimum touch target dimensions of `44x44px` with clear active/pressed feedback states.
4. **Dynamic Micro-Animations**: Use CSS transitions (`transition-all duration-200 ease-out`) or Framer Motion (`framer-motion`) for smooth modal entries, tab switches, and hover scales.

---

## 1. CSS Design Tokens & Variable System

Define standard tokens in `index.css` or Tailwind CSS variables:

```css
:root {
  --bg-primary: #090d16;
  --bg-surface: rgba(15, 23, 42, 0.75);
  --bg-surface-border: rgba(255, 255, 255, 0.1);
  --accent-primary: #6366f1;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --radius-lg: 1rem;
  --radius-md: 0.75rem;
}

.glass-panel {
  background: var(--bg-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--bg-surface-border);
  border-radius: var(--radius-lg);
}

.gradient-text {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 2. Accessible Composable Card Component (React + Tailwind)

```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'up'
}) => {
  return (
    <div className="glass-panel p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 group">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {change && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
```

---

## 3. Mobile PWA Bottom Sheet / Drawer Pattern

For touch-first mobile interfaces, use bottom drawer overlays instead of heavy desktop modals:

```tsx
import React from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full sm:max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
```
