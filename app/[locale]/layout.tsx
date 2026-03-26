import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1 pt-16">{children}</main>
      <WhatsAppFAB />
      <Footer locale={locale} dict={dict} />
    </>
  );
}
