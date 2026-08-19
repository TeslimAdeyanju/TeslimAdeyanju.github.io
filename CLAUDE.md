# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Teslim Adeyanju's personal portfolio site — static HTML/CSS/vanilla JS, no build step, no framework, no package manager. Deployed via GitHub Pages to a custom domain (see `CNAME`: adeyanjuteslim.co.uk).

## Commands

There is no build, lint, or test tooling (no `package.json`). To preview changes, just open the HTML files directly in a browser or serve the directory statically, e.g.:

```bash
python3 -m http.server 8000
```

The `.vscode/launch.json` config attaches VS Code's debugger to Chrome on port 9222 for live editing/debugging.

## Structure

- `index.html` — the main single-page site (nav, hero, skills, education, projects, contact — all sections on one page, linked via in-page anchors like `#hero`, `#skills`).
- `about.html` — separate standalone page, linked from the nav.
- `assets/css/styles.css` — all styling, ~2400 lines, organized into clearly delimited sections via `── Section Name ──` comment banners (Reset, Layout, Nav, Hero, Pillars, etc.). Follow this section-banner convention when adding new blocks of styles.
- `assets/js/script.js` — vanilla JS behavior for `index.html` only: sticky header shadow, mobile hamburger menu, dark/light theme toggle, animated count-up stats (via `IntersectionObserver`), 3D tilt effect on the hero photo.
- `assets/img/`, `assets/files/` — images and the downloadable CV PDF.

## Important quirks

- **`about.html` does not load `assets/js/script.js`.** It has its own inline `<script>` block at the bottom of the file duplicating the header-scroll, mobile-menu, and theme-toggle logic (count-up and photo-tilt are hero-only features and aren't duplicated there). When changing shared behavior (menu toggle, theme toggle, scroll header), update **both** `assets/js/script.js` and the inline script in `about.html`.
- **Theming**: CSS custom properties in `:root` (styles.css) define the light theme as the default; dark-theme overrides live under `[data-theme="dark"] ...` selectors throughout the stylesheet. Theme choice persists via `localStorage.getItem('theme')`. Both `index.html` and `about.html` set `data-theme="dark"` on `<html>` by default and run an inline anti-flash script in `<head>` (before CSS loads) to apply the stored theme immediately and avoid a flash of the wrong theme.
- **GA4 tracking** (`G-4DHPYHV2EH`) and a custom GDPR cookie-consent banner are inlined in the `<head>` of `index.html`; keep both pages' tracking snippets consistent if editing one.
- No image optimization pipeline — assets are committed as-is (e.g. `photo.JPG`).
