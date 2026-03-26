import { prisma } from "@/lib/prisma";

export async function getServicePrices() {
  try {
    return await prisma.servicePrice.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    return [];
  }
}

export async function getShopItems() {
  try {
    return await prisma.shopItem.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function getPortfolioProjects() {
  try {
    return await prisma.portfolioProject.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}
