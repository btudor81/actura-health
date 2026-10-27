// Content source for the site: Sanity (project l8x1ig69, public dataset), read at
// build time. Publishing in the Studio fires a webhook to a Netlify build hook.
// The seed files have the same shape and stay as the fallback, so the build never
// blocks on the CMS: if Sanity cannot be reached, the build warns and uses them.
// CONTENT_SOURCE=seed forces the seed (offline work).
import { createClient } from '@sanity/client';
import homepageSeed from '../content/seed/homepage.json';
import siteSeed from '../content/seed/site.json';

export type Homepage = typeof homepageSeed;
export type Site = typeof siteSeed;

export const sanity = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'l8x1ig69',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
};

const client = createClient({
  ...sanity,
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'published',
});

// Sanity adds _key/_type/_id etc. Drop them so the data matches the seed exactly.
function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, v]) => [key, clean(v)]),
    );
  }
  return value;
}

// A field missing in the CMS (never filled, or added to the code later) takes the
// seed value, so a component never meets undefined. Lists come from the CMS as is.
function withDefaults<T>(cms: unknown, seed: T): T {
  if (seed && typeof seed === 'object' && !Array.isArray(seed)) {
    const source = (cms && typeof cms === 'object' ? cms : {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(seed).map(([key, value]) => [key, withDefaults(source[key], value)]),
    ) as T;
  }
  return (cms ?? seed) as T;
}

const QUERY = `{
  "homepage": *[_id == "homepage"][0],
  "site": *[_id == "siteSettings"][0]
}`;

type Loaded = { homepage: Homepage; site: Site };

async function load(): Promise<Loaded> {
  if (import.meta.env.CONTENT_SOURCE === 'seed') return { homepage: homepageSeed, site: siteSeed };
  try {
    const data = await client.fetch<{ homepage: unknown; site: unknown }>(QUERY);
    if (!data.homepage || !data.site) throw new Error('homepage or siteSettings not published');
    return {
      homepage: withDefaults(clean(data.homepage), homepageSeed),
      // The PDF always serves from /files (see pdfFromSanity in astro.config.mjs).
      site: withDefaults(clean(data.site), siteSeed),
    };
  } catch (error) {
    console.warn(`[content] Sanity unavailable, building from seed files: ${(error as Error).message}`);
    return { homepage: homepageSeed, site: siteSeed };
  }
}

// One fetch per build, shared by every page and component.
let loaded: Promise<Loaded> | undefined;
const content = () => (loaded ??= load());

export async function getHomepage(): Promise<Homepage> {
  return (await content()).homepage;
}

export async function getSite(): Promise<Site> {
  return (await content()).site;
}
