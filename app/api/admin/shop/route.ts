import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.shopItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();

  await prisma.shopItem.create({
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
