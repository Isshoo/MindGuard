const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.diagnosis.deleteMany();
  await prisma.consultationSymptom.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.disease.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: hashedPassword,
      name: "Administrator",
      role: "admin",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create Diseases
  console.log("🏥 Creating diseases...");
  const depresi = await prisma.disease.create({
    data: {
      code: "P01",
      name: "Depresi Mayor",
      description:
        "Gangguan mood yang ditandai dengan kesedihan mendalam, kehilangan minat, dan berbagai gejala fisik dan kognitif yang berlangsung minimal 2 minggu.",
    },
  });

  const gad = await prisma.disease.create({
    data: {
      code: "P02",
      name: "Gangguan Kecemasan Umum (GAD)",
      description:
        "Gangguan yang ditandai dengan kecemasan dan kekhawatiran berlebihan tentang berbagai hal yang sulit dikendalikan, berlangsung minimal 6 bulan.",
    },
  });

  const panik = await prisma.disease.create({
    data: {
      code: "P03",
      name: "Gangguan Panik",
      description:
        "Gangguan yang ditandai dengan serangan panik berulang yang tidak terduga, disertai rasa takut akan serangan berikutnya.",
    },
  });

  console.log("✅ Created 3 diseases");

  // Create Symptoms
  console.log("🩺 Creating symptoms...");
  const kesedihan = await prisma.symptom.create({
    data: {
      code: "G01",
      name: "Kesedihan berkepanjangan (>2 minggu)",
      description: "Perasaan sedih, kosong, atau putus asa yang berlangsung hampir sepanjang hari, hampir setiap hari",
    },
  });

  const anhedonia = await prisma.symptom.create({
    data: {
      code: "G02",
      name: "Kehilangan minat/kesenangan (anhedonia)",
      description: "Kehilangan minat atau kesenangan pada hampir semua aktivitas yang sebelumnya dinikmati",
    },
  });

  const gangguanTidur = await prisma.symptom.create({
    data: {
      code: "G03",
      name: "Gangguan tidur (insomnia/hypersomnia)",
      description: "Kesulitan tidur atau tidur berlebihan hampir setiap hari",
    },
  });

  const kelelahan = await prisma.symptom.create({
    data: {
      code: "G04",
      name: "Kelelahan/kehilangan energi",
      description: "Merasa lelah atau kehilangan energi hampir setiap hari",
    },
  });

  const kecemasan = await prisma.symptom.create({
    data: {
      code: "G05",
      name: "Kecemasan berlebihan",
      description: "Kecemasan dan kekhawatiran berlebihan tentang berbagai hal yang sulit dikendalikan",
    },
  });

  const sulitKonsentrasi = await prisma.symptom.create({
    data: {
      code: "G06",
      name: "Sulit konsentrasi",
      description: "Kesulitan berpikir, berkonsentrasi, atau membuat keputusan",
    },
  });

  const seranganPanik = await prisma.symptom.create({
    data: {
      code: "G07",
      name: "Serangan panik mendadak",
      description: "Episode ketakutan atau ketidaknyamanan intens yang tiba-tiba, mencapai puncak dalam beberapa menit",
    },
  });

  const jantungBerdebar = await prisma.symptom.create({
    data: {
      code: "G08",
      name: "Jantung berdebar-debar",
      description: "Detak jantung yang cepat atau berdebar kencang (palpitasi)",
    },
  });

  console.log("✅ Created 8 symptoms");

  // Create Rules (Likelihood P(Symptom|Disease))
  console.log("📋 Creating rules...");

  // Rules untuk Depresi Mayor
  await prisma.rule.createMany({
    data: [
      { diseaseId: depresi.id, symptomId: kesedihan.id, probability: 0.8 },
      { diseaseId: depresi.id, symptomId: anhedonia.id, probability: 0.7 },
      { diseaseId: depresi.id, symptomId: gangguanTidur.id, probability: 0.6 },
      { diseaseId: depresi.id, symptomId: kelelahan.id, probability: 0.5 },
      { diseaseId: depresi.id, symptomId: kecemasan.id, probability: 0.4 },
      { diseaseId: depresi.id, symptomId: sulitKonsentrasi.id, probability: 0.6 },
    ],
  });

  // Rules untuk Gangguan Kecemasan Umum (GAD)
  await prisma.rule.createMany({
    data: [
      { diseaseId: gad.id, symptomId: kesedihan.id, probability: 0.4 },
      { diseaseId: gad.id, symptomId: gangguanTidur.id, probability: 0.5 },
      { diseaseId: gad.id, symptomId: kelelahan.id, probability: 0.6 },
      { diseaseId: gad.id, symptomId: kecemasan.id, probability: 0.9 },
      { diseaseId: gad.id, symptomId: sulitKonsentrasi.id, probability: 0.7 },
      { diseaseId: gad.id, symptomId: seranganPanik.id, probability: 0.3 },
      { diseaseId: gad.id, symptomId: jantungBerdebar.id, probability: 0.5 },
    ],
  });

  // Rules untuk Gangguan Panik
  await prisma.rule.createMany({
    data: [
      { diseaseId: panik.id, symptomId: gangguanTidur.id, probability: 0.4 },
      { diseaseId: panik.id, symptomId: kecemasan.id, probability: 0.7 },
      { diseaseId: panik.id, symptomId: sulitKonsentrasi.id, probability: 0.3 },
      { diseaseId: panik.id, symptomId: seranganPanik.id, probability: 0.9 },
      { diseaseId: panik.id, symptomId: jantungBerdebar.id, probability: 0.8 },
    ],
  });

  console.log("✅ Created rules for all diseases");

  console.log("\n🎉 Database seeding completed successfully!\n");
  console.log("📊 Summary:");
  console.log("   - Users: 1 (admin)");
  console.log("   - Diseases: 3");
  console.log("   - Symptoms: 8");
  console.log("   - Rules: 18");
  console.log("🔐 Login credentials:");
  console.log("   Email: admin@gmail.com");
  console.log("   Password: admin123\n");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
