import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.servicePrice.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as { id: string; price: number };

  await prisma.servicePrice.update({
    where: { id: payload.id },
    data: { price: Number(payload.price) },
  });

  revalidatePath("/id/hardware");
  revalidatePath("/en/hardware");

  return NextResponse.json({ ok: true });
}
