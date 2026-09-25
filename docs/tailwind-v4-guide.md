# Tailwind CSS v4 — Architecture & Configuration Guide

## 1. Overview
Tailwind CSS v4 is a major rewrite powered by the high-performance **Oxide engine** (written in Rust). It delivers up to 10x faster build performance, eliminates legacy configuration files, and embraces modern CSS-native features.

---

## 2. Key Differences: Tailwind v3 vs. Tailwind v4

| Dimension | Tailwind CSS v3 | Tailwind CSS v4 |
|---|---|---|
| **Bundler Integration** | PostCSS plugin (`postcss.config.js`) | Native Vite plugin (`@tailwindcss/vite`) |
| **Config File** | JavaScript-based `tailwind.config.js` | **CSS-first**: `@theme` block in CSS |
| **Imports** | `@tailwind base; @tailwind components; @tailwind utilities;` | Single `@import "tailwindcss";` |
| **Content Detection** | Manual glob array: `content: ['./src/**/*.{html,js,ts,jsx,tsx}']` | **Automatic**: zero configuration required |
| **Variables Model** | JS-to-CSS generation mapping | Direct native CSS variables (`--color-*`, `--font-*`) |
| **Browser Engine** | Polyfills + Autoprefixer required | Modern CSS specs (`@property`, `color-mix`, Cascade Layers) |

---

## 3. Configuration in this Project

### 1. Dependencies (`client/package.json`)
```json
"devDependencies": {
  "@tailwindcss/vite": "^4.0.0",
  "tailwindcss": "^4.0.0"
}
```

### 2. Vite Integration (`client/vite.config.ts`)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### 3. CSS Setup (`client/src/styles/globals.css`)
```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Outfit', var(--font-sans);

  --color-bg-app: #0f172a;
  --color-bg-surface: #1e293b;
  --color-bg-surface-hover: #334155;
  --color-bg-card: #1e293b;
  --color-bg-card-hover: #283548;
  --color-bg-sidebar: #090d16;

  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-accent: #8b5cf6;

  --color-priority-low: #10b981;
  --color-priority-medium: #3b82f6;
  --color-priority-high: #f59e0b;
  --color-priority-urgent: #ef4444;

  --color-border-subtle: #334155;
  --color-border-medium: #475569;
}
```

---

## 4. Best Practices in this Codebase
1. **Hybrid Synergy**: Use Tailwind utility classes (e.g., `flex`, `grid`, `gap-4`, `p-6`, `rounded-xl`, `border`, `shadow-lg`) for structural positioning and responsiveness.
2. **Strict DRY Primitive Rule**: Interactive primitives (Buttons, Inputs, Modals, Badges, Avatars) must continue to be imported from `src/components/common/` to avoid code duplication across features.
