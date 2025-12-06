/**
 * Implementasi Teorema Bayes sesuai jurnal Dermatitis Imun
 * Metode: Forward Chaining + Bayes Theorem (bukan Naive Bayes)
 */

export function calculateBayesTheorem(selectedSymptomIds, rules, diseases) {
  // Step 1: Forward Chaining - identifikasi penyakit yang relevan
  const relevantDiseases = identifyRelevantDiseases(selectedSymptomIds, rules, diseases);

  if (relevantDiseases.length === 0) {
    return [];
  }

  // Step 2: Hitung probabilitas untuk setiap penyakit
  const results = relevantDiseases.map((disease) => {
    const probability = calculateDiseaseProbability(disease.id, selectedSymptomIds, rules);

    return {
      diseaseId: disease.id,
      diseaseName: disease.name,
      diseaseCode: disease.code,
      probability: probability,
      symptoms: getRelevantSymptoms(disease.id, selectedSymptomIds, rules),
    };
  });

  // Urutkan berdasarkan probabilitas tertinggi
  return results.sort((a, b) => b.probability - a.probability);
}

/**
 * Forward Chaining: Identifikasi penyakit yang memiliki minimal 1 gejala cocok
 */
function identifyRelevantDiseases(selectedSymptomIds, rules, diseases) {
  const relevantDiseaseIds = new Set();

  rules.forEach((rule) => {
    if (selectedSymptomIds.includes(rule.symptomId)) {
      relevantDiseaseIds.add(rule.diseaseId);
    }
  });

  return diseases.filter((disease) => relevantDiseaseIds.has(disease.id));
}

/**
 * Hitung probabilitas penyakit menggunakan Teorema Bayes
 */
function calculateDiseaseProbability(diseaseId, selectedSymptomIds, rules) {
  // Filter rule yang relevan dengan penyakit dan gejala yang dipilih
  const relevantRules = rules.filter(
    (rule) => rule.diseaseId === diseaseId && selectedSymptomIds.includes(rule.symptomId)
  );

  if (relevantRules.length === 0) {
    return 0;
  }

  // Ambil nilai probabilitas P(Symptom|Disease)
  const probabilities = relevantRules.map((rule) => rule.probability);

  // Step 1: Hitung total bobot
  const totalWeight = probabilities.reduce((sum, prob) => sum + prob, 0);

  if (totalWeight === 0) {
    return 0;
  }

  // Step 2: Normalisasi P|H untuk setiap gejala
  const normalizedProbs = probabilities.map((prob) => prob / totalWeight);

  // Step 3: Hitung P(E|Hk) × P(Hk)
  let sumPEH = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sumPEH += probabilities[i] * normalizedProbs[i];
  }

  // Step 4: Hitung posterior untuk setiap gejala
  const posteriors = [];
  for (let i = 0; i < probabilities.length; i++) {
    const posterior = (probabilities[i] * normalizedProbs[i]) / sumPEH;
    posteriors.push(posterior);
  }

  // Step 5: Hitung total Bayes (∑Bayes)
  let bayesTotal = 0;
  for (let i = 0; i < probabilities.length; i++) {
    bayesTotal += probabilities[i] * posteriors[i];
  }

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
