// Edit site access lock. The live (static) site skips all of this.
//
// The edit site shows unpublished drafts, so only the Studio may open it. When the
// Studio's "Edit on page" tool loads the site, it first creates a short-lived
// secret in Sanity and opens /?sanity-preview-secret=...; the secret is checked
// against Sanity with the read token, and a signed session cookie is set. Any
// request without that cookie gets the "private preview" page.
import { defineMiddleware } from 'astro:middleware';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@sanity/client';
import { urlSearchParamPreviewSecret, validatePreviewUrl } from '@sanity/preview-url-secret';
import { sanity, visualEditing } from './lib/content';

const COOKIE = 'actura_edit';
const SESSION_S = 8 * 60 * 60;
const token = import.meta.env.SANITY_API_READ_TOKEN ?? '';
// Signing key derived from the read token: rotating the token signs everyone out.
const key = createHash('sha256').update(`actura-edit-session:${token}`).digest();

function sign(expires: number): string {
  return createHmac('sha256', key).update(String(expires)).digest('base64url');
}

function sessionCookie(): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_S;
  // The site runs inside the Studio's iframe, so the cookie is third-party:
  // SameSite=None + Partitioned (CHIPS) keep it working where third-party
  // cookies are otherwise blocked.
  return `${COOKIE}=${expires}.${sign(expires)}; Path=/; Max-Age=${SESSION_S}; HttpOnly; Secure; SameSite=None; Partitioned`;
}

function hasSession(header: string | null): boolean {
  const value = header?.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))?.[1];
  if (!value) return false;
  const [expires, signature = ''] = value.split('.');
  if (!(Number(expires) > Date.now() / 1000)) return false;
  const expected = Buffer.from(sign(Number(expires)));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

const PRIVATE = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

function locked(): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Private preview</title></head>` +
      `<body style="font:18px/1.5 system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 24px;color:#0f0068">` +
      `<h1 style="font-size:24px">Private preview</h1><p>This page shows unpublished changes and opens only from the Actura Health Studio.</p>` +
      `<p><a href="https://www.acturahealth.com" style="color:inherit">Go to acturahealth.com</a></p></body></html>`,
    { status: 401, headers: { ...PRIVATE, 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

const secretClient = createClient({ ...sanity, apiVersion: '2025-01-01', useCdn: false, token });

export const onRequest = defineMiddleware(async (context, next) => {
  if (!visualEditing) return next();

  const { url, request } = context;
  // TEMP debug 2026-10-28: remove after the Studio iframe issue is found.
  console.log('[edit-lock]', JSON.stringify({ path: url.pathname, secret: url.searchParams.has(urlSearchParamPreviewSecret), cookie: /actura_edit=/.test(request.headers.get('cookie') ?? ''), dest: request.headers.get('sec-fetch-dest'), site: request.headers.get('sec-fetch-site'), storage: request.headers.get('sec-fetch-storage-access'), referer: request.headers.get('referer') }));
  if (url.searchParams.has(urlSearchParamPreviewSecret)) {
    const { isValid, redirectTo } = await validatePreviewUrl(secretClient, url.toString());
    if (!isValid) return locked();
    // Only same-site paths, never "//other.host".
    const target = redirectTo?.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';
    return new Response(null, {
      status: 307,
      headers: { ...PRIVATE, Location: target, 'Set-Cookie': sessionCookie() },
    });
  }

  if (!hasSession(request.headers.get('cookie'))) return locked();

  const response = await next();
  for (const [name, value] of Object.entries(PRIVATE)) response.headers.set(name, value);
  return response;
});
