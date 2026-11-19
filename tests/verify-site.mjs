/**
 * Comprehensive Automated Verification Suite for Funngro Two-Page Website
 * Validates file structure, SEO metadata, JSON-LD schemas, internal links, images, and accessibility.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const SITE_DIR = path.join(ROOT, 'funngro-website');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`PASS  ${name}`);
    passed += 1;
  } catch (err) {
    console.error(`FAIL  ${name}\n      ${err.message}`);
    failed += 1;
  }
}

const requiredFiles = [
  'funngro-website/index.html',
  'funngro-website/company.html',
  'funngro-website/css/style.css',
  'funngro-website/js/script.js',
  'funngro-website/sitemap.xml',
  'funngro-website/robots.txt',
  'funngro-website/manifest.json',
  'funngro-website/README.md',
  'funngro-website/images/favicon.svg',
  'funngro-website/images/funngro-logo.svg',
  'funngro-website/images/funngro-logo-white.svg',
  'funngro-website/images/funngro-teen-projects-hero.webp',
  'funngro-website/images/funngro-teen-skill-collaboration.webp',
  'funngro-website/images/funngro-company-young-talent-hero.webp',
  'funngro-website/images/funngro-company-project-support.webp',
  'SEO-Audit-Report.md',
];

test('All required project files exist', () => {
  for (const relPath of requiredFiles) {
    const absPath = path.join(ROOT, relPath);
    assert.ok(fs.existsSync(absPath), `Missing required file: ${relPath}`);
  }
});

const indexHtml = fs.readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');
const companyHtml = fs.readFileSync(path.join(SITE_DIR, 'company.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(SITE_DIR, 'css/style.css'), 'utf8');
const scriptJs = fs.readFileSync(path.join(SITE_DIR, 'js/script.js'), 'utf8');

test('JavaScript syntax is valid', () => {
  execFileSync(process.execPath, ['--check', path.join(SITE_DIR, 'js/script.js')]);
});

test('index.html has exact required SEO title and meta description', () => {
  assert.match(indexHtml, /<title>Online Projects for Young Indians \| Funngro<\/title>/);
  assert.match(
    indexHtml,
    /content="Explore project opportunities, develop practical skills and gain experience through Funngro\. Discover opportunities for young people in India\."/
  );
});

test('company.html has exact required SEO title and meta description', () => {
  assert.match(companyHtml, /<title>Find Young Talent for Business Projects \| Funngro<\/title>/);
  assert.match(
    companyHtml,
    /content="Discover young talent for creative, digital and business projects\. Explore project-based collaboration opportunities with Funngro\."/
  );
});

test('Both pages contain canonical, robots, Open Graph, and Twitter Card metadata', () => {
  for (const [label, html] of [
    ['index.html', indexHtml],
    ['company.html', companyHtml],
  ]) {
    assert.match(html, /<link\s+rel="canonical"\s+href="[^"]+"/s, `${label}: missing canonical`);
    assert.match(html, /<meta\s+name="robots"\s+content="index, follow"/s, `${label}: missing robots`);
    assert.match(html, /<meta\s+property="og:title"/s, `${label}: missing og:title`);
    assert.match(html, /<meta\s+property="og:description"/s, `${label}: missing og:description`);
    assert.match(html, /<meta\s+property="og:image"/s, `${label}: missing og:image`);
    assert.match(html, /<meta\s+name="twitter:card"\s+content="summary_large_image"/s, `${label}: missing twitter:card`);
  }
});

test('Both pages have exactly one H1 and semantic HTML5 landmarks', () => {
  for (const [label, html] of [
    ['index.html', indexHtml],
    ['company.html', companyHtml],
  ]) {
    const h1Count = (html.match(/<h1\b/g) || []).length;
    assert.equal(h1Count, 1, `${label}: expected 1 <h1>, found ${h1Count}`);
    for (const tag of ['header', 'nav', 'main', 'section', 'article', 'footer']) {
      assert.match(html, new RegExp(`<${tag}\\b`), `${label}: missing <${tag}>`);
    }
  }
});

test('Structured data JSON-LD parses cleanly and contains required schemas', () => {
  for (const [label, html] of [
    ['index.html', indexHtml],
    ['company.html', companyHtml],
  ]) {
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(match, `${label}: missing JSON-LD script`);
    const parsed = JSON.parse(match[1]);
    assert.ok(Array.isArray(parsed['@graph']), `${label}: JSON-LD missing @graph`);
    const types = parsed['@graph'].map((node) => node['@type']);
    for (const requiredType of ['Organization', 'WebSite', 'BreadcrumbList', 'FAQPage']) {
      assert.ok(types.includes(requiredType), `${label}: JSON-LD missing ${requiredType}`);
    }
  }
});

test('All local assets, internal links, and anchor targets resolve cleanly', () => {
  const pageMap = new Map([
    ['index.html', indexHtml],
    ['company.html', companyHtml],
  ]);

  for (const [pageName, html] of pageMap.entries()) {
    const attrMatches = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of attrMatches) {
      if (
        ref.startsWith('http://') ||
        ref.startsWith('https://') ||
        ref.startsWith('mailto:')
      ) {
        continue;
      }
      if (ref.startsWith('#')) {
        const id = ref.slice(1);
        assert.ok(html.includes(`id="${id}"`), `${pageName}: broken anchor target #${id}`);
        continue;
      }

      const [filePart, hashPart] = ref.split('#');
      const targetPath = path.join(SITE_DIR, filePart);
      assert.ok(fs.existsSync(targetPath), `${pageName}: broken relative path "${ref}"`);

      if (hashPart && pageMap.has(filePart)) {
        assert.ok(
          pageMap.get(filePart).includes(`id="${hashPart}"`),
          `${pageName}: broken cross-page anchor "${ref}"`
        );
      }
    }
  }
});

test('All <img> elements specify alt, width, and height attributes', () => {
  for (const [label, html] of [
    ['index.html', indexHtml],
    ['company.html', companyHtml],
  ]) {
    const imgTags = html.match(/<img\b[\s\S]*?>/g) || [];
    assert.ok(imgTags.length >= 2, `${label}: expected at least 2 images`);
    for (const img of imgTags) {
      assert.match(img, /\balt="[^"]+"/, `${label}: image missing descriptive alt: ${img}`);
      assert.match(img, /\bwidth="\d+"/, `${label}: image missing width: ${img}`);
      assert.match(img, /\bheight="\d+"/, `${label}: image missing height: ${img}`);
    }
  }
});

test('CSS includes accessibility focus rings, reduced motion, and responsive breakpoints', () => {
  assert.match(styleCss, /:focus-visible/);
  assert.match(styleCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(styleCss, /overflow-x:\s*hidden/);
  assert.match(styleCss, /@media\s*\(min-width:\s*960px\)/);
});

test('Manifest, sitemap.xml, and robots.txt are valid and well-formed', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'manifest.json'), 'utf8'));
  assert.equal(manifest.start_url, 'index.html');
  assert.ok(fs.existsSync(path.join(SITE_DIR, manifest.icons[0].src)));

  const sitemap = fs.readFileSync(path.join(SITE_DIR, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /index\.html/);
  assert.match(sitemap, /company\.html/);

  const robots = fs.readFileSync(path.join(SITE_DIR, 'robots.txt'), 'utf8');
  assert.match(robots, /Sitemap:/);
  assert.match(robots, /Allow:\s*\//);
});

test('Interactive handlers exist in Vanilla JS for menu, filters, FAQ, modals, and forms', () => {
  assert.match(scriptJs, /menu-toggle/);
  assert.match(scriptJs, /data-filter-group/);
  assert.match(scriptJs, /\.faq-trigger/);
  assert.match(scriptJs, /data-open-modal/);
  assert.match(scriptJs, /teen-demo-form/);
  assert.match(scriptJs, /company-demo-form/);
  assert.match(scriptJs, /back-to-top/);
});

console.log(`\nSummary: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
