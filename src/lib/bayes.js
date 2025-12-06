/**
 * ==========================================
 * IMPLEMENTASI TEOREMA BAYES
 * ==========================================
 *
 * Metode: Forward Chaining + Teorema Bayes
 *
 * TAHAPAN:
 * 1. Forward Chaining: Identifikasi penyakit yang cocok dengan gejala
 * 2. Teorema Bayes: Hitung probabilitas untuk setiap penyakit
 * 3. Ranking: Urutkan berdasarkan probabilitas tertinggi
 */

export function calculateBayesTheorem(selectedSymptomIds, rules, diseases) {
  console.log("\n========================================");
  console.log("MULAI PERHITUNGAN TEOREMA BAYES");
  console.log("========================================");
  console.log("Gejala yang dipilih:", selectedSymptomIds.length, "gejala\n");

  // STEP 1: FORWARD CHAINING
  console.log("--- STEP 1: FORWARD CHAINING ---");
  const relevantDiseases = forwardChaining(selectedSymptomIds, rules, diseases);

  if (relevantDiseases.length === 0) {
    console.log("❌ Tidak ada penyakit yang cocok dengan gejala yang dipilih\n");
    return [];
  }

  console.log("✅ Penyakit yang lolos Forward Chaining:", relevantDiseases.length);
  relevantDiseases.forEach((disease, index) => {
    console.log(`   ${index + 1}. ${disease.name} (${disease.code})`);
  });
  console.log("");

  // STEP 2: HITUNG PROBABILITAS BAYES
  console.log("--- STEP 2: PERHITUNGAN TEOREMA BAYES ---\n");
  const results = relevantDiseases.map((disease, index) => {
    console.log(`[${index + 1}/${relevantDiseases.length}] Menghitung: ${disease.name}`);
    console.log("─────────────────────────────────────");

    const probability = calculateDiseaseProbability(disease.id, disease.name, selectedSymptomIds, rules);

    return {
      diseaseId: disease.id,
      diseaseName: disease.name,
      diseaseCode: disease.code,
      probability: probability,
      symptoms: getRelevantSymptoms(disease.id, selectedSymptomIds, rules),
    };
  });

  // STEP 3: RANKING
  console.log("\n--- STEP 3: RANKING HASIL ---");
  const sortedResults = results.sort((a, b) => b.probability - a.probability);

  console.log("\n📊 HASIL AKHIR (diurutkan):");
  sortedResults.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.diseaseName}: ${(result.probability * 100).toFixed(2)}%`);
  });

  console.log("\n========================================");
  console.log("SELESAI");
  console.log("========================================\n");

  return sortedResults;
}

/**
 * ==========================================
 * FORWARD CHAINING
 * ==========================================
 *
 * Fungsi ini memeriksa apakah gejala yang dipilih user
 * memenuhi minimal threshold untuk setiap penyakit.
 *
 * Threshold: Minimal 30% dari total gejala penyakit harus cocok
 * DAN harus ada minimal 2 gejala yang cocok
 */
function forwardChaining(selectedSymptomIds, rules, diseases) {
  const diseaseMatches = new Map();

  // Hitung jumlah gejala yang cocok per penyakit
  rules.forEach((rule) => {
    if (selectedSymptomIds.includes(rule.symptomId)) {
      if (!diseaseMatches.has(rule.diseaseId)) {
        diseaseMatches.set(rule.diseaseId, {
          matchCount: 0,
          totalSymptoms: 0,
          matchedSymptoms: [],
        });
      }

      const match = diseaseMatches.get(rule.diseaseId);
      match.matchCount++;
      match.matchedSymptoms.push(rule.symptomId);
    }
  });

  // Hitung total gejala per penyakit
  rules.forEach((rule) => {
    if (!diseaseMatches.has(rule.diseaseId)) {
      diseaseMatches.set(rule.diseaseId, {
        matchCount: 0,
        totalSymptoms: 0,
        matchedSymptoms: [],
      });
    }

    const match = diseaseMatches.get(rule.diseaseId);
    match.totalSymptoms++;
  });

  // Filter penyakit yang memenuhi threshold
  const relevantDiseases = diseases.filter((disease) => {
    const match = diseaseMatches.get(disease.id);

    if (!match || match.matchCount === 0) {
      console.log(`   ❌ ${disease.name}: Tidak ada gejala yang cocok`);
      return false;
    }

    const matchPercentage = (match.matchCount / match.totalSymptoms) * 100;

    // RULE: Minimal 1 gejala
    const isRelevant = match.matchCount >= 1 && matchPercentage >= 1;

    if (isRelevant) {
      console.log(
        `   ✅ ${disease.name}: ${match.matchCount}/${match.totalSymptoms} gejala cocok (${matchPercentage.toFixed(
          1
        )}%)`
      );
    } else {
      console.log(
        `   ❌ ${disease.name}: ${match.matchCount}/${match.totalSymptoms} gejala cocok (${matchPercentage.toFixed(
          1
        )}%) - Tidak memenuhi threshold`
      );
    }

    return isRelevant;
  });

  return relevantDiseases;
}

/**
 * ==========================================
 * PERHITUNGAN TEOREMA BAYES
 * ==========================================
 *
 * Formula dari jurnal:
 * 1. Total bobot = Σ P(Gejala|Penyakit)
 * 2. Normalisasi = P(Gi|Penyakit) / Total bobot
 * 3. Evidence = Σ [P(Gi|Penyakit) × Normalisasi]
 * 4. Posterior = [P(Gi|Penyakit) × Normalisasi] / Evidence
 * 5. Total Bayes = Σ [P(Gi|Penyakit) × Posterior]
 */
function calculateDiseaseProbability(diseaseId, diseaseName, selectedSymptomIds, rules) {
  // Ambil rule yang relevan
  const relevantRules = rules.filter(
    (rule) => rule.diseaseId === diseaseId && selectedSymptomIds.includes(rule.symptomId)
  );

  if (relevantRules.length === 0) {
    console.log("   ⚠️  Tidak ada rule yang cocok\n");
    return 0;
  }

  // Ambil probabilitas dari setiap gejala
  const probabilities = relevantRules.map((rule) => rule.probability);

  console.log(`   Gejala yang cocok: ${probabilities.length} gejala`);
  probabilities.forEach((prob, index) => {
    const symptomName = relevantRules[index].symptom?.name || "Unknown";
    console.log(`      - ${symptomName}: ${prob} (${(prob * 100).toFixed(0)}%)`);
  });

  // LANGKAH 1: Hitung Total Bobot
  const totalWeight = probabilities.reduce((sum, prob) => sum + prob, 0);
  console.log(`\n   Langkah 1 - Total Bobot:`);
  console.log(`      ${probabilities.join(" + ")} = ${totalWeight.toFixed(4)}`);

  if (totalWeight === 0) {
    console.log("   ⚠️  Total bobot = 0, skip perhitungan\n");
    return 0;
  }

  // LANGKAH 2: Normalisasi P|H
  const normalizedProbs = probabilities.map((prob) => prob / totalWeight);
  console.log(`\n   Langkah 2 - Normalisasi (P|H):`);
  normalizedProbs.forEach((norm, index) => {
    console.log(`      P|H${index + 1} = ${probabilities[index]} / ${totalWeight.toFixed(4)} = ${norm.toFixed(4)}`);
  });

  // LANGKAH 3: Hitung Evidence P(E|Hk) × P(Hk)
  let evidence = 0;
  const evidenceDetails = [];
  for (let i = 0; i < probabilities.length; i++) {
    const contribution = probabilities[i] * normalizedProbs[i];
    evidence += contribution;
    evidenceDetails.push(`(${probabilities[i]} × ${normalizedProbs[i].toFixed(4)})`);
  }

  console.log(`\n   Langkah 3 - Evidence:`);
  console.log(`      ${evidenceDetails.join(" + ")}`);
  console.log(`      = ${evidence.toFixed(4)}`);

  if (evidence === 0) {
    console.log("   ⚠️  Evidence = 0, skip perhitungan\n");
    return 0;
  }

  // LANGKAH 4: Hitung Posterior P(Hi|E)
  const posteriors = [];
  console.log(`\n   Langkah 4 - Posterior P(Hi|E):`);
  for (let i = 0; i < probabilities.length; i++) {
    const numerator = probabilities[i] * normalizedProbs[i];
    const posterior = numerator / evidence;
    posteriors.push(posterior);
    console.log(
      `      P(H${i + 1}|E) = (${probabilities[i]} × ${normalizedProbs[i].toFixed(4)}) / ${evidence.toFixed(
        4
      )} = ${posterior.toFixed(4)}`
    );
  }

  // LANGKAH 5: Hitung Total Bayes (∑Bayes)
  let bayesTotal = 0;
  const bayesDetails = [];
  for (let i = 0; i < probabilities.length; i++) {
    const contribution = probabilities[i] * posteriors[i];
    bayesTotal += contribution;
    bayesDetails.push(`(${probabilities[i]} × ${posteriors[i].toFixed(4)})`);
  }

  console.log(`\n   Langkah 5 - Total Bayes (∑Bayes):`);
  console.log(`      ${bayesDetails.join(" + ")}`);
  console.log(`      = ${bayesTotal.toFixed(4)}`);
  console.log(`\n   🎯 HASIL: ${diseaseName} = ${(bayesTotal * 100).toFixed(2)}%\n`);

  return bayesTotal;
}

/**
 * Ambil gejala yang relevan dengan penyakit tertentu
 */
function getRelevantSymptoms(diseaseId, selectedSymptomIds, rules) {
  return rules
    .filter((rule) => rule.diseaseId === diseaseId && selectedSymptomIds.includes(rule.symptomId))
    .map((rule) => ({
      symptomId: rule.symptomId,
      probability: rule.probability,
    }));
}
