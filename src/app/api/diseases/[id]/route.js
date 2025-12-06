import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const disease = await prisma.disease.findUnique({
      where: { id: id },
      include: {
        rules: {
          include: {
            symptom: true,
          },
        },
      },
    });

    if (!disease) {
      return NextResponse.json({ error: "Penyakit tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(disease);
  } catch (error) {
    console.error("Get disease error:", error);
    return NextResponse.json({ error: "Gagal mengambil data penyakit" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { code, name, description } = await request.json();

    // Validate input data jika sudah ada dalam database
    const existingDisease = await prisma.disease.findUnique({ where: { id } });
    if (!existingDisease) {
      return NextResponse.json({ error: "Penyakit tidak ditemukan" }, { status: 404 });
    }

    if (code !== existingDisease.code) {
      const existingDiseaseWithCode = await prisma.disease.findUnique({ where: { code, NOT: { id: id } } });
      if (existingDiseaseWithCode) {
        return NextResponse.json({ error: "Kode penyakit sudah digunakan" }, { status: 400 });
      }
    }

    if (name !== existingDisease.name) {
      const existingDiseaseWithName = await prisma.disease.findFirst({ where: { name, NOT: { id: id } } });
      if (existingDiseaseWithName) {
        return NextResponse.json({ error: "Nama penyakit sudah digunakan" }, { status: 400 });
      }
    }

    if (description !== existingDisease.description) {
      const existingDiseaseWithDescription = await prisma.disease.findFirst({
        where: { description, NOT: { id: id } },
      });
      if (existingDiseaseWithDescription) {
        return NextResponse.json({ error: "Deskripsi penyakit sudah digunakan" }, { status: 400 });
      }
    }

    const disease = await prisma.disease.update({
      where: { id: id },
      data: { code, name, description },
    });

    return NextResponse.json(disease);
  } catch (error) {
    console.error("Update disease error:", error);
    return NextResponse.json({ error: "Gagal mengupdate penyakit" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.diagnosis.deleteMany();
    await prisma.consultationSymptom.deleteMany();
    await prisma.consultation.deleteMany();

    await prisma.disease.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Penyakit berhasil dihapus" });
  } catch (error) {
    console.error("Delete disease error:", error);
    return NextResponse.json({ error: "Gagal menghapus penyakit" }, { status: 500 });
  }
}
