import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const symptoms = await prisma.symptom.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(symptoms);
  } catch (error) {
    console.error("Get symptoms error:", error);
    return NextResponse.json({ error: "Gagal mengambil data gejala" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { code, name, description } = await request.json();

    const existingSymptom = await prisma.symptom.findUnique({ where: { code } });
    if (existingSymptom) {
      return NextResponse.json({ error: "Kode gejala sudah digunakan" }, { status: 400 });
    }
    const existingName = await prisma.symptom.findFirst({ where: { name } });
    if (existingName) {
      return NextResponse.json({ error: "Nama gejala sudah digunakan" }, { status: 400 });
    }
    if (description) {
      const existingDescription = await prisma.symptom.findFirst({ where: { description } });
      if (existingDescription) {
        return NextResponse.json({ error: "Deskripsi gejala sudah digunakan" }, { status: 400 });
      }
    }

    const symptom = await prisma.symptom.create({
      data: { code, name, description },
    });

    return NextResponse.json(symptom);
  } catch (error) {
    console.error("Create symptom error:", error);
    return NextResponse.json({ error: "Gagal membuat gejala" }, { status: 500 });
  }
}
