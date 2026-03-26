import type { Locale } from "@/lib/i18n";

export function withLocale(locale: Locale, path: string) {
  if (path.startsWith("/")) {
    return `/${locale}${path}`;
  }

  return `/${locale}/${path}`;
}
