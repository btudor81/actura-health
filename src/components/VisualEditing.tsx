// Click-to-edit overlays for the Studio's Presentation tool. Rendered only on the
// edit site (PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true), never on the live site.
// The page is server-rendered from drafts, so after an edit a reload shows it.
import { VisualEditing as Overlays } from '@sanity/visual-editing/react';

export default function VisualEditing() {
  return (
    <Overlays
      portal
      zIndex={1000}
      refresh={() =>
        new Promise<void>(() => {
          window.location.reload();
        })
      }
    />
  );
}
