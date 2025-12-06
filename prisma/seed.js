const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database...");

  // Clear existing data (optional - hati-hati di production!)
  await prisma.diagnosis.deleteMany();
  await prisma.consultationSymptom.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.disease.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  console.log("👤 Membuat users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin System",
      role: "admin",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: hashedPassword,
      name: "Jane Doe",
      role: "user",
    },
  });

  console.log("✅ Users berhasil dibuat");

  // Seed Mental Health Disorders
  console.log("🧠 Membuat data gangguan mental...");
  const diseases = await Promise.all([
    prisma.disease.create({
      data: {
        code: "MH001",
        name: "Depresi Mayor (Major Depressive Disorder)",
        description:
          "Gangguan mood yang ditandai dengan perasaan sedih yang persisten dan kehilangan minat pada aktivitas",
      },
    }),
    prisma.disease.create({
      data: {
        code: "MH002",
        name: "Gangguan Kecemasan Umum (GAD)",
        description: "Kecemasan berlebihan yang terjadi hampir setiap hari selama minimal 6 bulan",
      },
    }),
    prisma.disease.create({
      data: {
        code: "MH003",
        name: "Gangguan Panik (Panic Disorder)",
        description: "Serangan panik berulang yang tidak terduga disertai ketakutan akan serangan berikutnya",
      },
    }),
    prisma.disease.create({
      data: {
        code: "MH004",
        name: "PTSD (Post-Traumatic Stress Disorder)",
        description: "Gangguan yang berkembang setelah mengalami atau menyaksikan peristiwa traumatis",
      },
    }),
    prisma.disease.create({
      data: {
        code: "MH005",
        name: "Gangguan Bipolar",
        description: "Gangguan mood dengan episode mania dan depresi yang bergantian",
      },
    }),
    prisma.disease.create({
      data: {
        code: "MH006",
        name: "OCD (Obsessive-Compulsive Disorder)",
        description: "Gangguan dengan pikiran obsesif dan perilaku kompulsif yang berulang",
      },
    }),
    prisma.disease.create({
      data: {
        code: "MH007",
        name: "Fobia Sosial (Social Anxiety Disorder)",
        description: "Ketakutan intens terhadap situasi sosial dan penilaian dari orang lain",
      },
    }),
  ]);

  console.log("✅ Gangguan mental berhasil dibuat");

  // Seed Mental Health Symptoms
  console.log("💭 Membuat data gejala...");
  const symptoms = await Promise.all([
    prisma.symptom.create({
      data: {
        code: "S001",
        name: "Perasaan sedih berkepanjangan",
        description: "Merasa sedih, kosong, atau putus asa hampir sepanjang hari",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S002",
        name: "Kehilangan minat atau kesenangan",
        description: "Tidak lagi menikmati aktivitas yang dulu disukai",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S003",
        name: "Gangguan tidur",
        description: "Insomnia atau tidur berlebihan (hypersomnia)",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S004",
        name: "Kelelahan atau kehilangan energi",
        description: "Merasa lelah sepanjang waktu tanpa sebab jelas",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S005",
        name: "Perubahan nafsu makan",
        description: "Nafsu makan berkurang atau meningkat drastis",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S006",
        name: "Pikiran untuk bunuh diri",
        description: "Pikiran tentang kematian atau percobaan bunuh diri",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S007",
        name: "Kesulitan konsentrasi",
        description: "Sulit fokus, mengingat, atau membuat keputusan",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S008",
        name: "Perasaan bersalah berlebihan",
        description: "Merasa tidak berharga atau bersalah tanpa alasan jelas",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S009",
        name: "Kegelisahan atau ketegangan",
        description: "Merasa gelisah, tegang, atau mudah terkejut",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S010",
        name: "Khawatir berlebihan",
        description: "Khawatir tidak terkontrol tentang berbagai hal",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S011",
        name: "Mudah tersinggung",
        description: "Mood yang mudah berubah dan mudah marah",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S012",
        name: "Ketegangan otot",
        description: "Otot terasa tegang atau kaku",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S013",
        name: "Serangan panik",
        description: "Episode ketakutan intens dengan gejala fisik seperti jantung berdebar, berkeringat",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S014",
        name: "Takut kehilangan kontrol",
        description: "Ketakutan akan kehilangan kendali atau mati saat serangan panik",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S015",
        name: "Menghindari tempat tertentu",
        description: "Menghindari tempat atau situasi yang memicu panik",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S016",
        name: "Kilas balik (flashback)",
        description: "Mengalami kembali peristiwa traumatis secara mendadak",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S017",
        name: "Mimpi buruk berulang",
        description: "Mimpi buruk tentang trauma yang dialami",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S018",
        name: "Menghindari pengingat trauma",
        description: "Menghindari orang, tempat, atau aktivitas yang mengingatkan trauma",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S019",
        name: "Kewaspadaan berlebihan",
        description: "Selalu waspada dan mudah terkejut",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S020",
        name: "Episode mania",
        description: "Periode dengan energi tinggi, euforia, atau iritabilitas abnormal",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S021",
        name: "Bicara cepat",
        description: "Berbicara lebih cepat dari biasanya",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S022",
        name: "Perilaku impulsif",
        description: "Mengambil keputusan terburu-buru atau perilaku berisiko",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S023",
        name: "Berkurangnya kebutuhan tidur",
        description: "Merasa berenergi meskipun tidur sedikit",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S024",
        name: "Pikiran obsesif",
        description: "Pikiran, dorongan, atau gambaran yang tidak diinginkan dan berulang",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S025",
        name: "Perilaku kompulsif",
        description: "Perilaku berulang yang merasa harus dilakukan untuk mengurangi kecemasan",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S026",
        name: "Ritual berlebihan",
        description: "Melakukan ritual seperti mencuci tangan, mengecek, atau menghitung berulang kali",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S027",
        name: "Takut dihakimi orang lain",
        description: "Ketakutan intens akan penilaian negatif dari orang lain",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S028",
        name: "Menghindari interaksi sosial",
        description: "Menghindari situasi sosial atau pertunjukan publik",
      },
    }),
    prisma.symptom.create({
      data: {
        code: "S029",
        name: "Gejala fisik saat situasi sosial",
        description: "Berkeringat, gemetar, atau mual saat berinteraksi sosial",
      },
    }),
  ]);

  console.log("✅ Gejala berhasil dibuat");

  // Seed Rules (Disease-Symptom relationships with probabilities)
  console.log("📋 Membuat aturan diagnosa...");

  // Depresi Mayor (MH001)
  await prisma.rule.createMany({
    data: [
      { diseaseId: diseases[0].id, symptomId: symptoms[0].id, probability: 0.95 }, // Perasaan sedih
      { diseaseId: diseases[0].id, symptomId: symptoms[1].id, probability: 0.9 }, // Kehilangan minat
      { diseaseId: diseases[0].id, symptomId: symptoms[2].id, probability: 0.85 }, // Gangguan tidur
      { diseaseId: diseases[0].id, symptomId: symptoms[3].id, probability: 0.9 }, // Kelelahan
      { diseaseId: diseases[0].id, symptomId: symptoms[4].id, probability: 0.75 }, // Perubahan nafsu makan
      { diseaseId: diseases[0].id, symptomId: symptoms[5].id, probability: 0.7 }, // Pikiran bunuh diri
      { diseaseId: diseases[0].id, symptomId: symptoms[6].id, probability: 0.8 }, // Kesulitan konsentrasi
      { diseaseId: diseases[0].id, symptomId: symptoms[7].id, probability: 0.85 }, // Perasaan bersalah
    ],
  });

  // GAD (MH002)
  await prisma.rule.createMany({
    data: [
      { diseaseId: diseases[1].id, symptomId: symptoms[8].id, probability: 0.95 }, // Kegelisahan
      { diseaseId: diseases[1].id, symptomId: symptoms[9].id, probability: 0.9 }, // Khawatir berlebihan
      { diseaseId: diseases[1].id, symptomId: symptoms[10].id, probability: 0.8 }, // Mudah tersinggung
      { diseaseId: diseases[1].id, symptomId: symptoms[11].id, probability: 0.85 }, // Ketegangan otot
      { diseaseId: diseases[1].id, symptomId: symptoms[6].id, probability: 0.75 }, // Kesulitan konsentrasi
      { diseaseId: diseases[1].id, symptomId: symptoms[2].id, probability: 0.8 }, // Gangguan tidur
      { diseaseId: diseases[1].id, symptomId: symptoms[3].id, probability: 0.7 }, // Kelelahan
    ],
  });

  // Gangguan Panik (MH003)
  await prisma.rule.createMany({
    data: [
      { diseaseId: diseases[2].id, symptomId: symptoms[12].id, probability: 0.95 }, // Serangan panik
      { diseaseId: diseases[2].id, symptomId: symptoms[13].id, probability: 0.9 }, // Takut kehilangan kontrol
      { diseaseId: diseases[2].id, symptomId: symptoms[14].id, probability: 0.85 }, // Menghindari tempat
      { diseaseId: diseases[2].id, symptomId: symptoms[8].id, probability: 0.8 }, // Kegelisahan
      { diseaseId: diseases[2].id, symptomId: symptoms[9].id, probability: 0.75 }, // Khawatir berlebihan
    ],
  });

  // PTSD (MH004)
  await prisma.rule.createMany({
    data: [
      { diseaseId: diseases[3].id, symptomId: symptoms[15].id, probability: 0.9 }, // Kilas balik
      { diseaseId: diseases[3].id, symptomId: symptoms[16].id, probability: 0.85 }, // Mimpi buruk
      { diseaseId: diseases[3].id, symptomId: symptoms[17].id, probability: 0.9 }, // Menghindari pengingat
      { diseaseId: diseases[3].id, symptomId: symptoms[18].id, probability: 0.85 }, // Kewaspadaan berlebihan
      { diseaseId: diseases[3].id, symptomId: symptoms[2].id, probability: 0.75 }, // Gangguan tidur
      { diseaseId: diseases[3].id, symptomId: symptoms[10].id, probability: 0.7 }, // Mudah tersinggung
    ],
  });

  // Gangguan Bipolar (MH005)
  await prisma.rule.createMany({
    data: [
      { diseaseId: diseases[4].id, symptomId: symptoms[19].id, probability: 0.95 }, // Episode mania
      { diseaseId: diseases[4].id, symptomId: symptoms[20].id, probability: 0.85 }, // Bicara cepat
      { diseaseId: diseases[4].id, symptomId: symptoms[21].id, probability: 0.8 }, // Perilaku impulsif
      { diseaseId: diseases[4].id, symptomId: symptoms[22].id, probability: 0.85 }, // Berkurangnya tidur
      { diseaseId: diseases[4].id, symptomId: symptoms[0].id, probability: 0.8 }, // Perasaan sedih (episode depresi)
      { diseaseId: diseases[4].id, symptomId: symptoms[1].id, probability: 0.75 }, // Kehilangan minat
    ],
  });

  // OCD (MH006)
  await prisma.rule.createMany({
    data: [
      { diseaseId: diseases[5].id, symptomId: symptoms[23].id, probability: 0.95 }, // Pikiran obsesif
      { diseaseId: diseases[5].id, symptomId: symptoms[24].id, probability: 0.95 }, // Perilaku kompulsif
      { diseaseId: diseases[5].id, symptomId: symptoms[25].id, probability: 0.9 }, // Ritual berlebihan
      { diseaseId: diseases[5].id, symptomId: symptoms[8].id, probability: 0.8 }, // Kegelisahan
      { diseaseId: diseases[5].id, symptomId: symptoms[6].id, probability: 0.7 }, // Kesulitan konsentrasi
    ],
  });

  // Fobia Sosial (MH007)
  await prisma.rule.createMany({
    data: [
      { diseaseId: diseases[6].id, symptomId: symptoms[26].id, probability: 0.95 }, // Takut dihakimi
      { diseaseId: diseases[6].id, symptomId: symptoms[27].id, probability: 0.9 }, // Menghindari sosial
      { diseaseId: diseases[6].id, symptomId: symptoms[28].id, probability: 0.85 }, // Gejala fisik sosial
      { diseaseId: diseases[6].id, symptomId: symptoms[8].id, probability: 0.85 }, // Kegelisahan
      { diseaseId: diseases[6].id, symptomId: symptoms[9].id, probability: 0.75 }, // Khawatir berlebihan
    ],
  });

  console.log("✅ Aturan diagnosa berhasil dibuat");

  // Seed Sample Consultation
  console.log("💬 Membuat contoh konsultasi...");
  const consultation = await prisma.consultation.create({
    data: {
      userId: user.id,
      patientName: "Jane Doe",
      patientAge: 28,
      patientGender: "Perempuan",
    },
  });

  // Add symptoms to consultation
  await prisma.consultationSymptom.createMany({
    data: [
      { consultationId: consultation.id, symptomId: symptoms[0].id }, // Perasaan sedih
      { consultationId: consultation.id, symptomId: symptoms[1].id }, // Kehilangan minat
      { consultationId: consultation.id, symptomId: symptoms[2].id }, // Gangguan tidur
      { consultationId: consultation.id, symptomId: symptoms[3].id }, // Kelelahan
    ],
  });

  // Add diagnosis
  await prisma.diagnosis.create({
    data: {
      consultationId: consultation.id,
      diseaseId: diseases[0].id, // Depresi Mayor
      probability: 0.88,
    },
  });

  console.log("✅ Contoh konsultasi berhasil dibuat");

  console.log("");
  console.log("🎉 Seeding selesai!");
  console.log("");
  console.log("📊 Ringkasan:");
  console.log(`   - Users: 2 (1 admin, 1 user)`);
  console.log(`   - Gangguan Mental: ${diseases.length}`);
  console.log(`   - Gejala: ${symptoms.length}`);
  console.log(`   - Aturan: ${await prisma.rule.count()}`);
  console.log("");
  console.log("🔐 Login credentials:");
  console.log("   Admin:");
  console.log("   - Email: admin@example.com");
  console.log("   - Password: password123");
  console.log("");
  console.log("   User:");
  console.log("   - Email: user@example.com");
  console.log("   - Password: password123");
  console.log("");
  console.log("⚠️  PENTING: Sistem ini hanya untuk tujuan edukasi.");
  console.log("   Untuk diagnosa dan penanganan yang tepat, selalu konsultasi dengan profesional kesehatan mental.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
