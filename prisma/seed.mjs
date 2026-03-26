import { PrismaClient, Role, ItemStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("admin12345", 10);

  await prisma.user.upsert({
    where: { email: "admin@solusidigital.id" },
    update: {},
    create: {
      email: "admin@solusidigital.id",
      name: "Admin SDP",
      hashedPassword: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.servicePrice.upsert({
    where: { slug: "iphone-diagnostic" },
    update: { price: 350000 },
    create: {
      slug: "iphone-diagnostic",
      title: "iPhone Deep Diagnostic",
      description: "Analisis logic board dan performa menyeluruh.",
      price: 350000,
    },
  });

  await prisma.servicePrice.upsert({
    where: { slug: "macbook-repair" },
    update: { price: 950000 },
    create: {
      slug: "macbook-repair",
      title: "MacBook Board Repair",
      description: "Perbaikan board level untuk MacBook.",
      price: 950000,
    },
  });

  await prisma.shopItem.createMany({
    data: [
      {
        name: "iPhone 14 Pro 256GB",
        imageUrl:
          "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=1200&auto=format&fit=crop",
        price: 14500000,
        status: ItemStatus.AVAILABLE,
        specs: "Battery health 95%, Face ID normal, resmi iBox.",
      },
      {
        name: "iPhone 13 128GB",
        imageUrl:
          "https://images.unsplash.com/photo-1603898037225-1f1b34f7f3ef?q=80&w=1200&auto=format&fit=crop",
        price: 9200000,
        status: ItemStatus.RESERVED,
        specs: "Battery health 90%, mulus, all sensor normal.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.portfolioProject.createMany({
    data: [
      {
        title: "Neural-Link Factory",
        category: "Industrial IoT",
        description: "Integrasi lini produksi otonom dengan edge analytics.",
        imageUrl:
          "https://images.unsplash.com/photo-1581093588401-22d5f94bbf07?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Enterprise Repair Workflow",
        category: "Hardware",
        description: "Sistem workflow servis terintegrasi untuk 4 cabang.",
        imageUrl:
          "https://images.unsplash.com/photo-1527443224154-c4b26d7d31a3?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
