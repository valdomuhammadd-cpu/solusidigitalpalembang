"use client";

import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  dict: {
    brand: string;
    nav: {
      hardware: string;
      software: string;
      iot: string;
      portfolio: string;
      about: string;
      getStarted: string;
    };
  };
};

export function Navbar({ locale, dict }: Props) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-headline text-sm font-black tracking-tight text-primary md:text-lg">
          <Image
            src="/logo.jpeg"
            alt={dict.brand}
            width={36}
            height={36}
            className="h-9 w-9 rounded-md object-cover"
            priority
          />
          <span>{dict.brand}</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href={`/${locale}/hardware`} className="text-sm font-semibold text-text/80 hover:text-primary">
            {dict.nav.hardware}
          </Link>
          <Link href={`/${locale}/portfolio`} className="text-sm font-semibold text-text/80 hover:text-primary">
            {dict.nav.portfolio}
          </Link>
          <Link href={`/${locale}/shop`} className="text-sm font-semibold text-text/80 hover:text-primary">
            Shop
          </Link>
          <LanguageSwitcher locale={locale} />
          <Link href={`/${locale}/login`} className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
            {dict.nav.getStarted}
          </Link>
        </div>
      </div>
    </nav>
  );
}
