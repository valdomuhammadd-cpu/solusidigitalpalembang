import type { Metadata } from "next";
import Link from "next/link";

import { getServicePrices } from "@/lib/data";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

type PriceRow = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "id";
  const dict = await getDictionary(safeLocale);
  return { title: dict.seo.hardwareTitle };
}

export default async function HardwarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return null;
  }

  const [dict, prices] = await Promise.all([getDictionary(locale), getServicePrices()]);
  const rows = prices as PriceRow[];
  const wa = `https://wa.me/6282278801777?text=${encodeURIComponent(dict.hardware.whatsappMessage)}`;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-8">
      <h1 className="font-headline text-4xl font-black tracking-tight text-text">{dict.hardware.title}</h1>
      <p className="mt-3 text-text/70">{dict.hardware.description}</p>
      <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-surface text-left text-xs uppercase tracking-widest text-text/60">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: PriceRow) => (
              <tr key={row.id} className="border-t border-gray-100 text-sm">
                <td className="px-6 py-4 font-semibold">{row.title}</td>
                <td className="px-6 py-4 text-text/70">{row.description}</td>
                <td className="px-6 py-4 font-bold text-primary">Rp {row.price.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href={wa} target="_blank" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white">
        {dict.hardware.whatsappLabel}
      </Link>
    </section>
  );
}
