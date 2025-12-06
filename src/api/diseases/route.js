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

    const disease = await prisma.disease.create({
      data: { code, name, description },
    });

    return NextResponse.json(disease);
  } catch (error) {
    console.error("Create disease error:", error);
    return NextResponse.json({ error: "Gagal membuat penyakit" }, { status: 500 });
  }
}
