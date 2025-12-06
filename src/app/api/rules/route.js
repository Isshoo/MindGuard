import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
      include: {
        disease: true,
        symptom: true,
      },
      orderBy: {
        disease: {
          code: "asc",
        },
      },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Get rules error:", error);
    return NextResponse.json({ error: "Gagal mengambil data aturan" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { diseaseId, symptomId, probability } = await request.json();

    const existingRule = await prisma.rule.findUnique({
      where: { diseaseId_symptomId: { diseaseId, symptomId } },
    });
    if (existingRule) {
      return NextResponse.json({ error: "Aturan sudah ada" }, { status: 400 });
    }

    await prisma.diagnosis.deleteMany();
    await prisma.consultationSymptom.deleteMany();
    await prisma.consultation.deleteMany();

    const rule = await prisma.rule.create({
      data: {
        diseaseId,
        symptomId,
        probability: parseFloat(probability),
      },
      include: {
        disease: true,
        symptom: true,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Create rule error:", error);
    return NextResponse.json({ error: "Gagal membuat aturan" }, { status: 500 });
  }
}
