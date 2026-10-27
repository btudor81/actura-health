// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { writeFile } from 'node:fs/promises';

const SANITY_PROJECT = process.env.PUBLIC_SANITY_PROJECT_ID || 'l8x1ig69';
const SANITY_DATASET = process.env.PUBLIC_SANITY_DATASET || 'production';

// The capability statement always serves from one address, so the buttons and the
// /capability-statement redirect never change. A PDF uploaded in the Studio (Site
// settings > Buttons) replaces the copy in public/files at build time.
function pdfFromSanity() {
  return {
    name: 'pdf-from-sanity',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (process.env.CONTENT_SOURCE === 'seed') return;
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
  output: 'static',
  devToolbar: { enabled: false },
  // The original build keeps 4321. This copy (21st.dev components) runs beside it.
  server: { port: 4322 },
  integrations: [react(), pdfFromSanity()],
  vite: {
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
      ],
    },
    build: {
      // County networks run older Chromium, Edge and Firefox ESR builds.
      target: ['chrome90', 'edge90', 'firefox91', 'safari14'],
      cssTarget: ['chrome90', 'edge90', 'firefox91', 'safari14'],
    },
  },
});
