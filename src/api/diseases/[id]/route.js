import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const disease = await prisma.disease.findUnique({
      where: { id: params.id },
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
    const { code, name, description } = await request.json();

    const disease = await prisma.disease.update({
      where: { id: params.id },
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
    await prisma.disease.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Penyakit berhasil dihapus" });
  } catch (error) {
    console.error("Delete disease error:", error);
    return NextResponse.json({ error: "Gagal menghapus penyakit" }, { status: 500 });
  }
}
