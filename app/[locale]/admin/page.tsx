import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getPortfolioProjects, getServicePrices, getShopItems } from "@/lib/data";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return null;
  }

  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect(`/${locale}/login?error=unauthorized`);
  }

  const [dict, prices, shop, projects] = await Promise.all([
    getDictionary(locale),
    getServicePrices(),
    getShopItems(),
    getPortfolioProjects(),
  ]);

  return <AdminDashboard labels={dict.admin} initialPrices={prices} initialShop={shop} initialProjects={projects} />;
}
