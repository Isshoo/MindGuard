import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBayesTheorem } from "@/lib/bayes";

export async function POST(request) {
  try {
    const { patientName, patientAge, patientGender, symptomIds } =
      await request.json();

    if (!symptomIds || symptomIds.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal 1 gejala" },
        { status: 400 }
      );
    }

    // Ambil semua rules dan diseases
    const rules = await prisma.rule.findMany({
      include: {
        disease: true,
        symptom: true,
      },
    });

    const diseases = await prisma.disease.findMany();

    // Hitung probabilitas menggunakan Teorema Bayes
    const results = calculateBayesTheorem(symptomIds, rules, diseases);

    if (results.length === 0) {
      return NextResponse.json(
        {
          error:
            "Tidak ditemukan penyakit yang cocok dengan gejala yang dipilih",
        },
        { status: 404 }
      );
    }

    // Simpan consultation
    const consultation = await prisma.consultation.create({
      data: {
        patientName: patientName || "",
        patientAge: patientAge || 0,
        patientGender: patientGender || "",
        symptoms: {
          create: symptomIds.map((symptomId) => ({
            symptomId,
          })),
        },
        diagnoses: {
          create: results.map((result) => ({
            diseaseId: result.diseaseId,
            probability: result.probability,
          })),
        },
      },
      include: {
        symptoms: {
          include: {
            symptom: true,
          },
        },
        diagnoses: {
          include: {
            disease: true,
          },
          orderBy: {
            probability: "desc",
          },
        },
      },
    });

    return NextResponse.json({
      consultation,
      results,
    });
  } catch (error) {
    console.error("Consultation error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan konsultasi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const consultations = await prisma.consultation.findMany({
      include: {
        symptoms: {
          include: {
            symptom: true,
          },
        },
        diagnoses: {
          include: {
            disease: true,
          },
          orderBy: {
            probability: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Get consultations error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data konsultasi" },
      { status: 500 }
    );
  }
}
