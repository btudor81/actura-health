// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const SANITY_PROJECT = process.env.PUBLIC_SANITY_PROJECT_ID || 'l8x1ig69';
const SANITY_DATASET = process.env.PUBLIC_SANITY_DATASET || 'production';

// The edit site (Netlify actura-health-edit, same repo) sets this flag. It renders on
// every request from drafts so the Studio's Presentation tool shows edits as they
// happen. The live site stays a static build.
const VISUAL_EDITING = process.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';

// The capability statement always serves from one address, so the buttons and the
// /capability-statement redirect never change. A PDF uploaded in the Studio (Site
// settings > Buttons) replaces the copy in public/files at build time.
function pdfFromSanity() {
  return {
    name: 'pdf-from-sanity',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (process.env.CONTENT_SOURCE === 'seed' || VISUAL_EDITING) return;
        const query = encodeURIComponent('*[_id == "siteSettings"][0].capabilityStatement.asset->url');
        try {
          const res = await fetch(`https://${SANITY_PROJECT}.api.sanity.io/v2025-01-01/data/query/${SANITY_DATASET}?query=${query}`);
          const { result: url } = await res.json();
          if (!url) return logger.info('No PDF in Sanity, keeping public/files copy.');
          const pdf = await fetch(url);
          if (!pdf.ok) throw new Error(`PDF download ${pdf.status}`);
          await writeFile(new URL('files/actura-health-capability-statement.pdf', dir), Buffer.from(await pdf.arrayBuffer()));
          logger.info(`Capability statement taken from Sanity: ${url}`);
        } catch (error) {
          logger.warn(`Capability statement from Sanity failed, keeping public/files copy: ${error.message}`);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.acturahealth.com',
  ...(VISUAL_EDITING ? { output: 'server', adapter: netlify() } : { output: 'static' }),
  devToolbar: { enabled: false },
  // The original build keeps 4321. This copy (21st.dev components) runs beside it.
  server: { port: 4322 },
  integrations: [react(), pdfFromSanity()],
  vite: {
    // Live site: the overlay package resolves to an empty stub (see VISUAL_EDITING).
    ...(VISUAL_EDITING
      ? {}
      : { resolve: { alias: { '@sanity/visual-editing/react': fileURLToPath(new URL('./src/lib/visual-editing-off.ts', import.meta.url)) } } }),
    // Pre-bundle what the islands import, at startup. Left to lazy discovery, the dev
    // server answers 504 "Outdated Optimize Dep" for islands that load on scroll
    // (services filter, contact block) after a cache reset, and they never hydrate.
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'motion/react',
        '@radix-ui/react-slot',
        '@radix-ui/react-tabs',
        '@radix-ui/react-label',
        '@radix-ui/react-separator',
        '@tabler/icons-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        '@sanity/visual-editing/react',
      ],
    },
    build: {
      // County networks run older Chromium, Edge and Firefox ESR builds.
      target: ['chrome90', 'edge90', 'firefox91', 'safari14'],
      cssTarget: ['chrome90', 'edge90', 'firefox91', 'safari14'],
    },
  },
});
