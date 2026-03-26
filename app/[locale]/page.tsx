import type { Metadata } from "next";

import { AchievementsSection } from "@/components/home/AchievementsSection";
import { FrictionSection } from "@/components/home/FrictionSection";
import { HeroSection } from "@/components/home/HeroSection";
import { QuotationCalculator } from "@/components/home/QuotationCalculator";
import { ServicesBento } from "@/components/home/ServicesBento";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "id";
  const dict = await getDictionary(safeLocale);

  return {
    title: dict.seo.homeTitle,
    description: dict.seo.homeDescription,
    alternates: {
      languages: {
        id: "/id",
        en: "/en",
      },
    },
  };
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return null;
  }

  const dict = await getDictionary(locale);

  return (
    <>
      <HeroSection
        headline={dict.hero.headline}
        subHeadline={dict.hero.subHeadline}
        primaryCta={dict.hero.primaryCta}
        mascotAlt={dict.hero.mascotAlt}
      />
      <FrictionSection items={dict.friction.items} bridge={dict.friction.bridge} />
      <ServicesBento
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        items={dict.services.items}
        locale={locale}
        caseStudies={dict.services.caseStudies}
        modalCopy={dict.services.modal}
        robotFox={dict.services.robotFox}
      />
      <AchievementsSection
        eyebrow={dict.achievements.eyebrow}
        title={dict.achievements.title}
        flagship={dict.achievements.flagship}
        counters={dict.achievements.counters}
        partners={dict.achievements.partners}
        about={dict.achievements.about}
      />
      <QuotationCalculator dict={dict.quotationCalculator} />
      <section className="bg-white px-6 py-24 text-center md:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-surface p-12 shadow-sm">
          <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-text md:text-5xl">{dict.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-text/70">{dict.cta.description}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 md:flex-row">
            <button className="rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-white">{dict.cta.primary}</button>
            <button className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-text">{dict.cta.secondary}</button>
          </div>
        </div>
      </section>
    </>
  );
}
