# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Teslim Adeyanju's personal portfolio site: static HTML/CSS/vanilla JS with no build step, framework or package manager. GitHub Pages deploys it from `main` to a custom domain (see `CNAME`: adeyanjuteslim.co.uk).

## Commands

There is no build, lint, or test tooling. To preview, serve the directory statically (the project pages fetch READMEs over the network, so use a server, not `file://`):

```bash
python3 -m http.server 8000
```

`.vscode/launch.json` attaches VS Code's debugger to Chrome on port 9222.

## Pages

- `index.html`: the main single-page site. Sections are linked by in-page anchors (`#hero`, `#skills`, …). The homepage section order is hero → About (`#about`) → Tools (`#skills`) → Projects → Experience → Certifications (`#certifications`) → Education → Contact (certifications first on purpose: they carry more weight for finance/data roles) (`#connect`); the nav mirrors it, except that Education has no menu link: the Certifications link covers both sections and the scrollspy keeps it active while Education is in view.
  - The hero (`.hero.hero-net`, `hn-*` classes) is centred, white in light mode and slate in dark mode. It uses the `--hn-font` stack: `'Avenir Next', Avenir, 'Nunito Sans'`. Avenir Next ships with Apple devices, and Nunito Sans loads from Google Fonts as the fallback elsewhere. It is transparent, so the site-wide network background shows behind it (see below).
  - Tools (`#skills`) is an open 3 × 2 grid of `tl-col` columns (no boxes): hairline, category title in its accent colour (`tk-<category>` sets `--tk`), tools as a two-column dotted list.
  - Projects uses the original `.proj-*` / `.ptag` card markup (featured FDA card, numbered cards). There is no filter and no "View all on GitHub" header button; the user removed it on purpose.
  - About (`ab-*`), Experience and Education (shared animated `xp-*` timeline) and Certifications (`cr-*`) use the "Homepage sections" CSS block. Its `--sx-*` tokens are redefined for dark mode.
  - Certifications is deliberately curated: 4 large badge cards in a 2×2 grid (ACA, PL-300, DP-900, SQL Analytics on Databricks) plus an "Additional certifications" text line (DataCamp SQL, HackerRank SQL Advanced, Databricks AI/BI) and a "Currently pursuing" line. Lesser credentials (AAT, the other Databricks accreditations, DataCamp, HackerRank, SuperDataScience) were removed on purpose; don't re-add them. Official badge images go in `assets/img/badges/`. The `.cr-card .cr-badge` selector is needed because the older `.badge-*` rules later in the file would otherwise shrink the badges.
  - Experience and Education share the `xp-*` timeline. `script.js` ("Timeline animation") toggles `.is-drawn` on each `.xp-timeline` and `.is-visible` on each `.xp-item` as they scroll into view; the line draws, entries slide in, dots pop and cards fade up. Reduced-motion users get the final state with no animation. The older `.timeline-*` and `.ed-*` styles are no longer used on the homepage.
- `about.html`, `blog.html`, `study-notes.html`: standalone top-level pages.
- `portfolio.html`: the Portfolio landing page, linked from the homepage Projects section (it replaced the old collapsible table; `all-projects.html` is only a redirect stub to it). It lists every public GitHub project that is not a featured card on the homepage. Cards are plain HTML grouped by skill (Power BI, Python and finance, SQL, machine learning, AI). A sticky "Contents" bar (`.ap-toc`) of anchor links jumps to each section, and a small inline script highlights the section in view; sections are separated by a fading divider. Each card has a header row (title on the left, the GitHub pill on the right, in `.ap-card-hd`), a two sentence overview, three short facts (`.ap-facts`) taken from the repository README or code, and tags; keep them accurate to what the repo actually contains and flag early stage work honestly. Empty repositories are left out. To add a project, add one `.ap-card` inside the right `.ap-group`, then update that group's number in the contents bar and the group's `data-layout` on `.ap-grid` (`f` one card, `h` two or four, `t` multiple of three, `t1` remainder one, `t2` remainder two); the layout value makes the last row of cards stretch to fill the width. A project sits in one group only; it goes under SQL when SQL is a core part of it (MySQL models or analytical queries), not when SQLite is just a small store. Study and learning repositories are left out on purpose.
- `projects/*.html`: one case-study page per featured project. Each `.html` has a sibling `.md`, which is a committed snapshot of that project repo's README. No page references the `.md` files. The live page fetches the README at runtime (see below).
- `mymotivationjournal/privacy.html`: the privacy policy for a mobile app. It is fully self-contained: it has inline `<style>`, does not use `styles.css`, and has no GA, theme or nav. Leave it out of site-wide changes.
- `sitemap.xml` lists every public page with a `lastmod`. When you add a page, add it here too, and update `lastmod` when a page changes meaningfully.

## Shared behavior is duplicated per page

Only `index.html` loads `assets/js/script.js`. It covers the sticky header shadow, mobile hamburger menu, theme toggle, count-up stats via `IntersectionObserver`, and the typed role line. **Every other site page (about, blog, study-notes, all `projects/*.html`) has its own inline `<script>` at the bottom.** That script duplicates the header-scroll, mobile-menu and theme-toggle logic, including the inline sun/moon SVGs. The count-up and typing effects belong to the index page only and exist only in `script.js`. To change shared behavior, update `script.js` **and** the inline script in each page.

One piece of shared behaviour lives in its own file: `assets/js/nav-menu.js`, loaded by all 13 pages after `network-bg.js`. It watches the `.active` class that each page's own script toggles on `#nav-links`, then keeps `aria-expanded` and the ☰/✕ icon in step, and closes the mobile menu on an outside tap, Escape, scrolling more than 40px, or widening past 920px. The menu is 8 links. The hamburger shows at 920px and below (the full menu tightens between 921 and 1100px).

The `<head>` is duplicated in the same way. Every site page inlines:

- GA4 tracking (`G-4DHPYHV2EH`)
- the GDPR cookie banner (it stores acceptance in `localStorage['gdpr-consent']`)
- an anti-flash theme script that runs before the CSS loads

Keep these consistent across all pages. Pages in `projects/` reference assets with `../` paths.

## Theming

CSS custom properties in `:root` (`assets/css/styles.css`) define the light theme. Dark overrides live under `[data-theme="dark"] …` selectors throughout the stylesheet. Each page sets `data-theme="light"` on `<html>` by default (light/white is the default theme). The anti-flash script then applies the stored choice from `localStorage.getItem('theme')`.

## Project pages: live README rendering

Each `projects/*.html` contains a `<div class="readme-content" data-readme-repo="Owner/Repo" data-readme-branch="main" data-readme-autoload>`. The page loads `marked` (v12.0.2 from cdnjs) and `assets/js/readme-loader.js`. On `DOMContentLoaded`, the loader:

1. fetches `raw.githubusercontent.com/<repo>/<branch>/README.md`
2. strips the leading H1, since the page hero already shows the title
3. rewrites relative image URLs to raw URLs and relative link URLs to GitHub blob URLs
4. renders the result with `marked` and assigns slug IDs to headings
5. on failure, shows a "View it on GitHub" fallback

When a project repo is renamed or moved to another owner, update `data-readme-repo` and any GitHub links on that page. The `.md` snapshot doesn't have to be updated.

## Navigation

All 13 site pages share the same menu, in the homepage section order (8 links. Education is intentionally not in the menu, Certifications points to it; Insights is not in the menu either, it is the last card on the Blog page). Non-index pages link to `index.html#…`, with a `../` prefix inside `projects/`, and mark their own entry with `aria-current="page"`.
- The logo is the name (`.nav-logo` with `.nl-name`), shown in one uniform sky-to-indigo gradient.
- Links fade in one after another on load and grow a gradient underline on hover.
- On `index.html`, the "Nav scrollspy" in `script.js` adds `.is-active` to the link for the section in view.
- When editing the menu, update every page's `<nav class="nav-links">`.

## Site-wide network background

`assets/js/network-bg.js` is loaded by **every** site page; `mymotivationjournal/privacy.html` is the exception. It injects a fixed, full-window `<canvas id="site-network">` at `z-index: -1` that draws drifting, linked dots which reach toward the mouse. Colours come from the `--net-*` custom properties in `styles.css`, which have light and dark variants.
- It only shows through transparent or translucent backgrounds, which is why `.section-alt`, `.about-section-alt` and the hero use translucent or transparent backgrounds. Don't give full-width sections opaque backgrounds, or the effect disappears there. Cards stay opaque.
- The animation starts about 1.2s after load. A continuous `requestAnimationFrame` loop from the first frame freezes CSS animations and transitions in headless Chrome screenshots. For screenshots, use `--force-prefers-reduced-motion`; in that mode the canvas draws once and stays static.
- When adding a new page, include `<script src="assets/js/network-bg.js"></script>` before `</body>`, with a `../` prefix for pages in `projects/`.

## CSS conventions

All styles are in `assets/css/styles.css`, grouped into sections with `/* ── Section Name ── */` comment banners (Nav, Hero, Responsive, Theme toggle, Dark theme overrides, About page, Live README, etc.). Follow this convention when you add styles.
- All section headings use one size, `--h2-size`, defined in `:root`. This covers homepage `.s-title` and inner-page `.content-block h2`. Change that token rather than setting per-section sizes.
- Phone-specific fixes live at the end of the file ("Mobile refinements" and "Mobile usability" blocks), so they win over earlier responsive rules. Keep tap targets ≥ ~40px and small labels ≥ 12px on phones; re-check at 360, 390 and 430px widths for horizontal overflow before shipping.

## Assets

`assets/img/` holds images and `assets/files/` holds the downloadable CV PDF. There is no image optimization pipeline, so assets are committed as-is (e.g. `photo.JPG`).
