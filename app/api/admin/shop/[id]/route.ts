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

  await prisma.shopItem.update({
    where: { id },
    data: {
      name: payload.name,
      imageUrl: payload.imageUrl,
      price: Number(payload.price),
      status: payload.status,
      specs: payload.specs,
    },
  });

  revalidatePath("/id/shop");
  revalidatePath("/en/shop");

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

  await prisma.shopItem.delete({ where: { id } });

  revalidatePath("/id/shop");
  revalidatePath("/en/shop");

  return NextResponse.json({ ok: true });
}
