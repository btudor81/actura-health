// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.acturahealth.com',
  output: 'static',
  devToolbar: { enabled: false },
  // The original build keeps 4321. This copy (21st.dev components) runs beside it.
  server: { port: 4322 },
  integrations: [react()],
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
