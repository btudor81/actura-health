// Content source for the site. Stage 1 reads the local seed files only.
// Stage 2 swaps these for Sanity queries with the seed as fallback (same shape),
// so the build never blocks on the CMS.
import homepage from '../content/seed/homepage.json';
import site from '../content/seed/site.json';

export type Homepage = typeof homepage;
export type Site = typeof site;

export async function getHomepage(): Promise<Homepage> {
  return homepage;
}

export async function getSite(): Promise<Site> {
  return site;
}
