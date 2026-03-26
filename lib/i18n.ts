import "server-only";

export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export async function getDictionary(locale: Locale) {
  if (locale === "en") {
    return (await import("@/dictionaries/en.json")).default;
  }

  return (await import("@/dictionaries/id.json")).default;
}
