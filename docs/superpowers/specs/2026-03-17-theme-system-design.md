# Theme System Design - WouldByMarty

## Overview

Implement a comprehensive theming system for the WouldByMarty e-commerce site that supports multiple color palettes, light/dark modes, and swappable font pairings.

## Goals

- Enable easy visual rebranding by swapping palette definitions
- Support 4 distinct color palettes (Modern Artisan, Workshop Heritage, Sleek Contemporary, Monochromatic Minimalism)
- Provide light and dark mode variants that adapt to user device preference
- Allow manual toggle between light/dark modes
- Support swappable font pairings with Chango + Montserrat as defaults

---

## Design

### Theme Architecture

**Semantic Color Variables (60-30-10 Rule)**

Each palette defines colors mapped to semantic roles:

| Role | Usage | Percentage |
|------|-------|------------|
| `--color-bg-primary` | Main background, large sections | 60% (Dominant) |
| `--color-bg-secondary` | Cards, headers, secondary sections | 30% (Secondary) |
| `--color-text-primary` | Main body text | 60% |
| `--color-text-secondary` | Muted text, captions | 30% |
| `--color-accent` | CTAs, buy buttons, links | 10% (Accent) |
| `--color-accent-hover` | Button hover states | - |
| `--color-border` | Dividers, input borders | - |
| `--color-surface` | Elevated cards, modals | - |

**Palette Definitions**

1. **Modern Artisan** (Clean & Natural)
   - bg-primary: #F8F9FA, bg-secondary: #E9E5D6
   - text-primary: #22223B, text-secondary: #4A4E69
   - accent: #A3B18A

2. **Workshop Heritage** (Rugged & Warm)
   - bg-primary: #3D2B1F, bg-secondary: #4A3728
   - text-primary: #F8F9FA, text-secondary: #E9C46A
   - accent: #2D6A4F

3. **Sleek Contemporary** (Bold & Professional)
   - bg-primary: #1B263B, bg-secondary: #E0E1DD
   - text-primary: #E0E1DD, text-secondary: #8D99AE
   - accent: #005F73

4. **Monochromatic Minimalism**
   - bg-primary: #FAF9F6, bg-secondary: #F5F5DC
   - text-primary: #44352A, text-secondary: #B7A99A
   - accent: #C19A6B

### Light/Dark Mode

- **Detection**: Use CSS `prefers-color-scheme` media query
- **Override**: User toggle stores preference in localStorage
- **Default**: Follow system preference if no override set

### Font System

- **Heading Font**: Chango (Google Fonts)
- **Body Font**: Montserrat (Google Fonts)
- **CSS Variables**: `--font-heading`, `--font-body`
- **Implementation**: CSS imports in globals.css

---

## File Structure

```
apps/web/src/
├── app/
│   ├── globals.css              # CSS variables + base styles
│   └── layout.tsx              # Root layout with providers
├── components/
│   ├── ThemeProvider.tsx       # Theme context + hooks
│   ├── ThemeToggle.tsx        # Light/dark toggle button
│   └── ThemeSelector.tsx      # Palette picker dropdown
└── lib/
    └── themes.ts               # Theme configurations
```

---

## Components

### ThemeProvider (React Context)

- Manages current palette, color scheme (light/dark), system preference
- Provides `theme`, `setTheme(palette)`, `colorScheme`, `toggleColorScheme()`
- Persists preferences to localStorage
- Syncs with system preference changes

### ThemeToggle

- Icon button (sun/moon)
- Toggles between light and dark mode
- Shows current state visually

### ThemeSelector

- Dropdown showing palette names
- Updates ThemeProvider on selection
- Persists selection to localStorage

---

## Acceptance Criteria

1. Four palettes available and swappable via UI
2. Light/dark mode toggle works and persists preference
3. System preference is detected on first visit
4. All components use semantic CSS variables
5. Fonts load correctly (Chango headings, Montserrat body)
6. No flash of wrong theme on page load (use CSS or SSR)
7. Theme transitions are smooth (CSS transitions on colors)
