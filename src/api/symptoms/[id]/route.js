import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { code, name, description } = await request.json();

    const symptom = await prisma.symptom.update({
      where: { id: params.id },
      data: { code, name, description },
    });

    return NextResponse.json(symptom);
  } catch (error) {
    console.error("Update symptom error:", error);
    return NextResponse.json({ error: "Gagal mengupdate gejala" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.symptom.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Gejala berhasil dihapus" });
  } catch (error) {
    console.error("Delete symptom error:", error);
    return NextResponse.json({ error: "Gagal menghapus gejala" }, { status: 500 });
  }
}
