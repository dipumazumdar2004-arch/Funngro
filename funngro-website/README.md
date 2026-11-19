# Funngro Two-Page Website Redesign Concept

An original, responsive, SEO-optimized two-page website concept inspired by [Funngro](https://www.funngro.com/), built strictly with **HTML5**, **CSS3**, and **Vanilla JavaScript** for clean performance and effortless deployment on GitHub Pages.

## Project Structure

```text
funngro-website/
├── index.html          # Page 1: Funngro for Teens
├── company.html        # Page 2: Funngro for Companies
├── css/
│   └── style.css       # Shared design system, responsive grids, accessibility styles
├── js/
│   └── script.js       # Navigation drawer, FAQ accordion, category filters, modals, demo form validation
├── images/
│   ├── favicon.svg
│   ├── funngro-logo.svg
│   ├── funngro-logo-white.svg
│   ├── funngro-teen-projects-hero.webp
│   ├── funngro-teen-skill-collaboration.webp
│   ├── funngro-company-young-talent-hero.webp
│   └── funngro-company-project-support.webp
├── sitemap.xml         # XML sitemap (update placeholder domain before production deploy)
├── robots.txt          # Search crawler rules and sitemap pointer
├── manifest.json       # Web app metadata with relative paths
└── README.md           # Project setup and deployment guide
```

An accompanying technical and content SEO analysis is included in `../SEO-Audit-Report.md`.

## Key Features

- **Two Dedicated Audience Pages**:
  - `index.html` (**Funngro for Teens**): Focuses on young Indians discovering online projects, workflow clarity, six project categories, skill development benefits, a 3-step onboarding flow, and teen/parent FAQs.
  - `company.html` (**Funngro for Companies**): Focuses on businesses exploring project-based collaboration with young talent, six business project domains, a 4-stage project workflow, business benefits, and company FAQs.
- **Pure Frontend Stack**: Zero runtime framework dependencies, using semantic HTML5, modern CSS custom properties/Grid/Flexbox, and vanilla JavaScript.
- **Complete SEO Architecture**:
  - Tailored `<title>` and `<meta name="description">` per page.
  - Canonical placeholders, Open Graph tags, Twitter Card metadata, `sitemap.xml`, and `robots.txt`.
  - Schema.org JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, and `FAQPage` aligned to visible FAQ sections).
  - Descriptive `.webp` filenames with explicit `width`/`height` dimensions, `fetchpriority="high"` on above-the-fold hero images, and `loading="lazy"` on below-the-fold images.
- **Accessibility & Motion Restraint**:
  - Skip-to-content links, keyboard-navigable controls, visible `:focus-visible` outlines, ARIA attributes on mobile menus, accordions, and dialogs, and `prefers-reduced-motion` support.
- **Honest Concept Demonstration Forms**:
  - Client-side validation for both teen interest and company project brief demos, clearly labeled as frontend demonstrations that do not transmit data to Funngro servers.

## Running Locally

You can preview the static site directly with any local static server (or Vite from the repository root):

```bash
# Option 1: Using Python's built-in HTTP server inside funngro-website/
python3 -m http.server 8080

# Option 2: From the repository root via Vite dev server
npm run dev
```

## Deploying to GitHub Pages

1. Push the contents of `funngro-website/` to a GitHub repository (either at the root of the `main` branch or inside a `/docs` folder).
2. In **Repository Settings → Pages**, select the branch and folder containing `index.html`.
3. Update the placeholder `https://example.github.io/funngro-website/` URLs in:
   - `index.html` (`<link rel="canonical">` and `og:url` / JSON-LD `WebSite`)
   - `company.html` (`<link rel="canonical">` and `og:url` / JSON-LD `WebSite` / `BreadcrumbList`)
   - `sitemap.xml` (`<loc>` entries)
   - `robots.txt` (`Sitemap:` URL)
4. All asset links (`css/style.css`, `js/script.js`, `images/...`, `manifest.json`, and cross-page navigation) use relative paths so the site works seamlessly under both root domains and `/repo-name/` subpaths.

## Verification & Automated Testing

From the repository root, run the automated validation suite to verify HTML structure, SEO metadata, JSON-LD validity, internal links, image dimensions, and responsive CSS rules:

```bash
node tests/verify-site.mjs
```
