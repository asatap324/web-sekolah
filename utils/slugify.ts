export function slugify(title: string): string {
  return title
    .toLowerCase()
    .split(" ")
    .slice(0, 6)
    .join(" ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
