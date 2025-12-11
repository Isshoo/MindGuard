"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

export default function ConsultationPage() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [patientData, setPatientData] = useState({
    patientName: "",
    patientAge: 0,
    patientGender: "",
  });

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch("/api/symptoms");
      const data = await response.json();
      setSymptoms(data);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      alert("Gagal memuat data gejala");
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0) {
      alert("Pilih minimal 1 gejala");
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patientData,
          symptomIds: selectedSymptoms,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Simpan hasil ke sessionStorage untuk ditampilkan di halaman result
        sessionStorage.setItem("consultationResult", JSON.stringify(data));
        router.push("/consultation/result");
      } else {
        const error = await response.json();
        alert(error.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error submitting consultation:", error);
      alert("Terjadi kesalahan saat memproses konsultasi");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">
                MentalHealth AI
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Konsultasi Diagnosis
          </h1>
          <p className="text-lg text-gray-600">
            Isi data diri dan pilih gejala yang Anda alami untuk mendapatkan
            analisis
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-semibold">
                Penting untuk Diperhatikan:
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Hasil diagnosis ini hanya sebagai rujukan awal dan tidak
                menggantikan konsultasi dengan profesional kesehatan mental.
                Jika Anda mengalami gejala berat, segera hubungi psikolog atau
                psikiater.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Data Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Data Pasien (Optional)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={patientData.patientName}
                  onChange={(e) =>
                    setPatientData({
                      ...patientData,
                      patientName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usia
                  </label>
                  <input
                    type="number"
                    value={patientData.patientAge}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        patientAge: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan usia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={patientData.patientGender}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        patientGender: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Pilih Gejala yang Dialami
              </h2>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {selectedSymptoms.length} dari {symptoms.length} dipilih
              </span>
            </div>

            {symptoms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data gejala. Hubungi administrator.
              </div>
            ) : (
              <div className="space-y-3">
                {symptoms.map((symptom) => (
                  <label
                    key={symptom.id}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSymptoms.includes(symptom.id)
                        ? "bg-indigo-50 border-indigo-500"
                        : "bg-white border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom.id)}
                      onChange={() => toggleSymptom(symptom.id)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 mt-0.5"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900 block">
                        {symptom.name}
                      </span>
                      {symptom.description && (
                        <span className="text-sm text-gray-600 block mt-1">
                          {symptom.description}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={processing || selectedSymptoms.length === 0}
              className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Proses Diagnosis"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
