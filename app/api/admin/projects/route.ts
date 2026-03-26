import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.portfolioProject.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();

  await prisma.portfolioProject.create({
    data: {
      title: payload.title,
      category: payload.category,
      description: payload.description,
      imageUrl: payload.imageUrl,
    },
  });

  revalidatePath("/id/portfolio");
  revalidatePath("/en/portfolio");

  return NextResponse.json({ ok: true });
}
