const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

// Content keeps the literal "[CONFIRM: ...]" marker for any fact the client has
// not signed off. It renders as a visible chip so it cannot ship unnoticed.
// Once the text is edited in the CMS the marker, and the chip, are gone.
export function flag(value: string): string {
  return escapeHtml(value).replace(
    /\[CONFIRM:?\s*([^\]]*)\]/g,
    (_, note: string) => `<mark class="confirm">Confirm: ${note.trim()}</mark>`,
  );
}

// Headlines store the desktop line break as "\n". The space before the <br>
// keeps words apart when the break is hidden on small screens.
// Plain spaces and line breaks only. String.trim() also drops U+FEFF, which the edit
// site's hidden stega markers use, and would cut a marker at the end of a line.
function trimSpace(value: string): string {
  return value.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '');
}

export function headline(value: string): string {
  return value
    .split('\n')
    .map((line) => `<span class="row">${flag(trimSpace(line))}</span>`)
    .join(' <br class="br-d">');
}

// Short labels store a fixed break as "\n", so a row of them sets on the same
// number of lines.
export function rows(value: string): string {
  return value
    .split('\n')
    .map((line) => flag(trimSpace(line)))
    .join(' <br>');
}

export function plain(value: string): string {
  return value.replace(/\s*\n\s*/g, ' ');
}
