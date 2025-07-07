export function decodeHtml(html: string): string {
  return html
    .replace(/&lt;/g, '<') // <
    .replace(/&gt;/g, '>') // >
    .replace(/&amp;/g, '&') // &
    .replace(/&quot;/g, '"') // "
    .replace(/&#039;/g, "'"); // '
}
