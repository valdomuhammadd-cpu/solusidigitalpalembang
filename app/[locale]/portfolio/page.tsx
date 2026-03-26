import type { Metadata } from "next";
import Image from "next/image";

import { getPortfolioProjects } from "@/lib/data";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

type ProjectRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
};

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "id";
  const dict = await getDictionary(safeLocale);
  return { title: dict.seo.portfolioTitle };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return null;
  }

  const [dict, projects] = await Promise.all([getDictionary(locale), getPortfolioProjects()]);
  const rows = projects as ProjectRow[];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <h1 className="font-headline text-4xl font-black tracking-tight text-text">{dict.portfolio.title}</h1>
      <p className="mt-3 text-text/70">{dict.portfolio.description}</p>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {rows.map((project: ProjectRow) => (
          <article key={project.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <Image src={project.imageUrl} alt={project.title} width={960} height={640} className="h-56 w-full object-cover" />
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{project.category}</span>
              <h2 className="font-headline mt-2 text-2xl font-black text-text">{project.title}</h2>
              <p className="mt-2 text-sm text-text/70">{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
