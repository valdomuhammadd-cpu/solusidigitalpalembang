import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getShopItems } from "@/lib/data";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

type ShopItemRow = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  status: string;
  specs: string;
};

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = locale === "en" ? "en" : "id";
  const dict = await getDictionary(safeLocale);
  return { title: dict.seo.shopTitle };
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return null;
  }

  const [dict, items] = await Promise.all([getDictionary(locale), getShopItems()]);
  const rows = items as ShopItemRow[];
  const wa = `https://wa.me/6282278801777?text=${encodeURIComponent(dict.shop.whatsappMessage)}`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <h1 className="font-headline text-4xl font-black tracking-tight text-text">{dict.shop.title}</h1>
      <p className="mt-3 text-text/70">{dict.shop.description}</p>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {rows.map((item: ShopItemRow) => (
          <article key={item.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <Image src={item.imageUrl} alt={item.name} width={600} height={600} className="h-56 w-full object-cover" />
            <div className="p-5">
              <h2 className="font-headline text-xl font-black text-text">{item.name}</h2>
              <p className="mt-2 text-sm text-text/65">{item.specs}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-primary">Rp {item.price.toLocaleString("id-ID")}</span>
                <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text/60">{item.status}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Link href={wa} target="_blank" className="mt-10 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white">
        {dict.shop.whatsappLabel}
      </Link>
    </section>
  );
}
