// Stand-in for @sanity/visual-editing/react on the live (static) site, aliased in
// astro.config.mjs. Keeps the overlay code and its CSS out of the public build.
export function VisualEditing(_props: Record<string, unknown>) {
  return null;
}
