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

    const symptom = await prisma.symptom.create({
      data: { code, name, description },
    });

    return NextResponse.json(symptom);
  } catch (error) {
    console.error("Create symptom error:", error);
    return NextResponse.json({ error: "Gagal membuat gejala" }, { status: 500 });
  }
}
