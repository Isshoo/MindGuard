import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { code, name, description } = await request.json();

    // Validate input data jika sudah ada dalam database kecuali data yang sedang diupdate
    const existingSymptom = await prisma.symptom.findUnique({ where: { code, NOT: { id: id } } });
    if (existingSymptom) {
      return NextResponse.json({ error: "Kode gejala sudah digunakan" }, { status: 400 });
    }
    const existingName = await prisma.symptom.findFirst({ where: { name, NOT: { id: id } } });
    if (existingName) {
      return NextResponse.json({ error: "Nama gejala sudah digunakan" }, { status: 400 });
    }
    if (description) {
      const existingDescription = await prisma.symptom.findFirst({ where: { description, NOT: { id: id } } });
      if (existingDescription) {
        return NextResponse.json({ error: "Deskripsi gejala sudah digunakan" }, { status: 400 });
      }
    }

    const symptom = await prisma.symptom.update({
      where: { id: id },
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
    const { id } = await params;
    await prisma.symptom.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Gejala berhasil dihapus" });
  } catch (error) {
    console.error("Delete symptom error:", error);
    return NextResponse.json({ error: "Gagal menghapus gejala" }, { status: 500 });
  }
}
