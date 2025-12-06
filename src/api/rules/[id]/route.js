import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { probability } = await request.json();

    const rule = await prisma.rule.update({
      where: { id: params.id },
      data: { probability: parseFloat(probability) },
      include: {
        disease: true,
        symptom: true,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Update rule error:", error);
    return NextResponse.json({ error: "Gagal mengupdate aturan" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.rule.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Aturan berhasil dihapus" });
  } catch (error) {
    console.error("Delete rule error:", error);
    return NextResponse.json({ error: "Gagal menghapus aturan" }, { status: 500 });
  }
}
