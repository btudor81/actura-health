// Click-to-edit overlays for the Studio's Presentation tool. Rendered only on the
// edit site (PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true), never on the live site.
//
// The page is server-rendered from drafts. After an edit the Studio asks for a
// refresh; a full reload would drop the connection to the Studio and lose what is
// typed while the page loads. So after a short pause in typing the page fetches
// itself again and patches the changed text into place: scroll position, nav and
// form scripts and the overlay connection all stay.
import { useEffect } from 'react';
import { VisualEditing as Overlays } from '@sanity/visual-editing/react';

const REGIONS = ['body > header', '#main', 'body > footer'];
const QUIET_MS = 500;

// Copy text and attributes from the fresh render onto the live DOM. A subtree whose
// shape changed (an item added or removed, another icon) is replaced whole.
// "class" is left alone so scroll-reveal state (.is-in) survives.
function patch(live: Node, fresh: Node): void {
  if (live.nodeType === Node.TEXT_NODE) {
    if (live.nodeValue !== fresh.nodeValue) live.nodeValue = fresh.nodeValue;
    return;
  }
  if (live instanceof Element && fresh instanceof Element) {
    if (live.tagName === 'ASTRO-ISLAND' && live.getAttribute('client') === 'only') return;
    for (const { name, value } of Array.from(fresh.attributes)) {
      if (name !== 'class' && live.getAttribute(name) !== value) live.setAttribute(name, value);
    }
  }
  const liveKids = Array.from(live.childNodes);
  const freshKids = Array.from(fresh.childNodes);
  if (liveKids.length !== freshKids.length) {
    replace(live, fresh);
    return;
  }
  liveKids.forEach((kid, i) => {
    const other = freshKids[i];
    if (kid.nodeType !== other.nodeType || kid.nodeName !== other.nodeName) replace(kid, other);
    else patch(kid, other);
  });
}

function replace(live: Node, fresh: Node): void {
  const copy = document.importNode(fresh, true);
  if (copy instanceof Element) copy.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
  if (copy instanceof Element && copy.classList.contains('reveal')) copy.classList.add('is-in');
  live.parentNode?.replaceChild(copy, live);
}

async function swapIn(): Promise<void> {
  const res = await fetch(window.location.href, { cache: 'no-store' });
  const next = new DOMParser().parseFromString(await res.text(), 'text/html');
  for (const selector of REGIONS) {
    const live = document.querySelector(selector);
    const fresh = next.querySelector(selector);
    if (live && fresh) patch(live, fresh);
  }
}

// The Studio sends a refresh per change, and again a second later. Wait for a
// quiet moment, then patch once and settle every pending request.
let timer: number | undefined;
let waiting: Array<() => void> = [];
function refreshSoon(): Promise<void> {
  return new Promise((resolve) => {
    waiting.push(resolve);
    window.clearTimeout(timer);
    timer = window.setTimeout(async () => {
      const done = waiting;
      waiting = [];
      try {
        await swapIn();
      } catch {
        window.location.reload();
      }
      done.forEach((settle) => settle());
    }, QUIET_MS);
  });
}

// The Studio sends no refresh when a draft is discarded (there is no draft left to
// report), so the page also checks itself every few seconds while it is on screen.
// Nothing changed means nothing is patched.
const RECHECK_MS = 10_000;

export default function VisualEditing() {
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) void refreshSoon();
    }, RECHECK_MS);
    return () => window.clearInterval(id);
  }, []);
  return <Overlays portal zIndex={1000} refresh={refreshSoon} />;
}
