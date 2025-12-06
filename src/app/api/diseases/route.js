import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const diseases = await prisma.disease.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(diseases);
  } catch (error) {
    console.error("Get diseases error:", error);
    return NextResponse.json({ error: "Gagal mengambil data penyakit" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { code, name, description } = await request.json();

    const existingDisease = await prisma.disease.findUnique({ where: { code } });
    if (existingDisease) {
      return NextResponse.json({ error: "Kode penyakit sudah digunakan" }, { status: 400 });
    }

    const existingName = await prisma.disease.findFirst({ where: { name } });
    if (existingName) {
      return NextResponse.json({ error: "Nama penyakit sudah digunakan" }, { status: 400 });
    }
    if (description) {
      const existingDescription = await prisma.disease.findFirst({ where: { description } });
      if (existingDescription) {
        return NextResponse.json({ error: "Deskripsi penyakit sudah digunakan" }, { status: 400 });
      }
    }

    await prisma.diagnosis.deleteMany();
    await prisma.consultationSymptom.deleteMany();
    await prisma.consultation.deleteMany();

    const disease = await prisma.disease.create({
      data: { code, name, description },
    });

    return NextResponse.json(disease);
  } catch (error) {
    console.error("Create disease error:", error);
    return NextResponse.json({ error: "Gagal membuat penyakit" }, { status: 500 });
  }
}
