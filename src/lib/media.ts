/**
 * Media carried over from the old site lives in /public/old under the same
 * relative paths it had there. Gallery photos use the full-size originals.
 */
export const OLD_BASE = process.env.NEXT_PUBLIC_OLD_MEDIA_BASE ?? "/old";
export const old = (path: string) => `${OLD_BASE}${path}`;
export const img = (name: string) => `/img/${name}.webp`;
export const workTeaser = (year: number, teaser: string) =>
  old(`/files/styles/ait/public/work/${year}/${teaser}.jpg`);
export const workPhoto = (year: number, file: string) =>
  old(`/files/styles/a/adaptive-image/public/work/${year}/${file}.jpg`);
