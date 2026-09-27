/** Next prefixes Link routes; plain media/fetch URLs need the same build-time prefix. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export function assetPath(path: string) { return `${BASE_PATH}${path}`; }
export function localHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//') ? `${BASE_PATH}${href}` : href;
}
