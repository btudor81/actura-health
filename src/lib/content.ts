// Content source for the site: Sanity (project l8x1ig69, public dataset).
//
// Live site: static build, published content, one fetch per build. Publishing in
// the Studio fires a webhook to a Netlify build hook.
// Edit site (PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true, Netlify site
// actura-health-edit): server-rendered on every request, drafts included, visible
// copy carries hidden stega markers so the Studio's Presentation tool can map a
// click on the page to its field.
//
// The seed files have the same shape and stay as the fallback, so the build never
// blocks on the CMS: if Sanity cannot be reached, it warns and uses them.
// CONTENT_SOURCE=seed forces the seed (offline work).
import { createClient, type FilterDefault } from '@sanity/client/stega';
import homepageSeed from '../content/seed/homepage.json';
import siteSeed from '../content/seed/site.json';

export type Homepage = typeof homepageSeed;
export type Site = typeof siteSeed;

export const visualEditing = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';
export const studioUrl = 'https://actura-health.sanity.studio';

export const sanity = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'l8x1ig69',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
};

// Stega only on text a reader sees. Values the code compares, looks up or puts in
// an attribute (icon names, PDSA phase, illustration keys, links, emails) and
// everything that goes to <head> (SEO, site name) stay clean.
const NO_STEGA = new Set(['icon', 'phase', 'visual', 'slug', 'href', 'url', 'contactEmail', 'linkedinUrl', 'bookingUrl']);

const stegaFilter: FilterDefault = (props) => {
  const { sourcePath, sourceDocument } = props;
  const key = String(sourcePath.at(-1));
  if (NO_STEGA.has(key)) return false;
  if (sourcePath[0] === 'seo') return false;
  if (sourceDocument?._type === 'siteSettings' && key === 'name') return false;
  return props.filterDefault(props);
};

const client = createClient({
  ...sanity,
  apiVersion: '2025-01-01',
  useCdn: false,
  ...(visualEditing
    ? {
        perspective: 'drafts',
        token: import.meta.env.SANITY_API_READ_TOKEN,
        stega: { enabled: true, studioUrl, filter: stegaFilter },
      }
    : { perspective: 'published' }),
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
    if (!data.homepage || !data.site) throw new Error('homepage or siteSettings not found');
    return {
      homepage: withDefaults(clean(data.homepage), homepageSeed),
      // The PDF always serves from /files (see pdfFromSanity in astro.config.mjs).
      site: withDefaults(clean(data.site), siteSeed),
    };
  } catch (error) {
    console.warn(`[content] Sanity unavailable, using seed files: ${(error as Error).message}`);
    return { homepage: homepageSeed, site: siteSeed };
  }
}

// Static build: one fetch shared by every page and component. Edit site: a server
// instance lives across requests, so a cached copy would hide new edits. A short
// window still lets the layout, nav and sections of one request share a fetch.
let loaded: Promise<Loaded> | undefined;
let loadedAt = 0;
function content(): Promise<Loaded> {
  if (visualEditing && Date.now() - loadedAt > 500) loaded = undefined;
  if (!loaded) {
    loaded = load();
    loadedAt = Date.now();
  }
  return loaded;
}

export async function getHomepage(): Promise<Homepage> {
  return (await content()).homepage;
}

export async function getSite(): Promise<Site> {
  return (await content()).site;
}
