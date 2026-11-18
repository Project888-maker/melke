/**
 * Media from the old site. Until the files are copied into /public/old,
 * they are loaded from the old domain. Change OLD_BASE in one place to switch.
 */
export const OLD_BASE = process.env.NEXT_PUBLIC_OLD_MEDIA_BASE ?? "https://eurotexno.ru";
export const old = (path: string) => `${OLD_BASE}${path}`;
export const img = (name: string) => `/img/${name}.webp`;
export const workTeaser = (year: number, teaser: string) =>
  old(`/files/styles/ait/public/work/${year}/${teaser}.jpg`);
export const workPhoto = (year: number, file: string) =>
  old(`/files/styles/a/adaptive-image/public/work/${year}/${file}.jpg`);
