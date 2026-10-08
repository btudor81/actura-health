// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.acturahealth.com',
  output: 'static',
  devToolbar: { enabled: false },
  vite: {
    build: {
      // County networks run older Chromium, Edge and Firefox ESR builds.
      target: ['chrome90', 'edge90', 'firefox91', 'safari14'],
      cssTarget: ['chrome90', 'edge90', 'firefox91', 'safari14'],
    },
  },
});
