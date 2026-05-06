const KEBAB_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidProductSlug(slug: string): boolean {
  return KEBAB_PATTERN.test(slug);
}
