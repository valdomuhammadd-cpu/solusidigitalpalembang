"use client";

import { usePathname, useRouter } from "next/navigation";

import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (target: Locale) => {
    const parts = pathname.split("/").filter(Boolean);
    parts[0] = target;
    router.push(`/${parts.join("/")}`);
  };

  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 text-xs font-bold uppercase tracking-widest">
      <button
        className={`rounded px-2 py-1 transition ${locale === "id" ? "bg-primary text-white" : "text-gray-500"}`}
        onClick={() => switchLanguage("id")}
        type="button"
      >
        ID
      </button>
      <button
        className={`rounded px-2 py-1 transition ${locale === "en" ? "bg-primary text-white" : "text-gray-500"}`}
        onClick={() => switchLanguage("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
