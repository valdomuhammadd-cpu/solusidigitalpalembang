import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = await request.json();

  await prisma.portfolioProject.update({
    where: { id },
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.portfolioProject.delete({ where: { id } });

  revalidatePath("/id/portfolio");
  revalidatePath("/en/portfolio");

  return NextResponse.json({ ok: true });
}
