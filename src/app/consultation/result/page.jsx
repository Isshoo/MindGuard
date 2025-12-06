"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Home, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data dari sessionStorage
    const data = sessionStorage.getItem("consultationResult");

    if (!data) {
      router.push("/consultation");
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      setResult(parsedData);
    } catch (error) {
      console.error("Error parsing result:", error);
      router.push("/consultation");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const { consultation, results } = result;
  const topResult = results[0];

  // Data untuk chart
  const chartData = results.map((r) => ({
    name: r.diseaseName.length > 20 ? r.diseaseName.substring(0, 20) + "..." : r.diseaseName,
    fullName: r.diseaseName,
    probabilitas: (r.probability * 100).toFixed(2),
  }));

  // Warna untuk bars
  const COLORS = ["#4f46e5", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">MentalHealth AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Cetak Hasil
              </button>
              <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors">
                <Home className="w-5 h-5" />
                Beranda
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hasil Diagnosis</h1>
          <p className="text-lg text-gray-600">Analisis berdasarkan gejala yang Anda alami</p>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Pasien</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nama</p>
              <p className="font-semibold text-gray-900">{consultation.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Usia</p>
              <p className="font-semibold text-gray-900">{consultation.patientAge} tahun</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jenis Kelamin</p>
              <p className="font-semibold text-gray-900">{consultation.patientGender}</p>
            </div>
          </div>
        </div>

        {/* Symptoms Selected */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gejala yang Dialami</h2>
          <div className="flex flex-wrap gap-2">
            {consultation.symptoms.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {item.symptom.name}
              </span>
            ))}
          </div>
        </div>

        {/* Main Result */}
        <div>
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Diagnosis Utama</h2>
            <p className="text-3xl font-bold mb-4">{topResult.diseaseName}</p>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm opacity-90">Probabilitas</p>
                <p className="text-4xl font-bold">{(topResult.probability * 100).toFixed(1)}%</p>
              </div>
              <div className="flex-1">
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${topResult.probability * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Grafik Probabilitas Semua Penyakit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis label={{ value: "Probabilitas (%)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border-2 border-indigo-200 rounded shadow-lg">
                        <p className="font-semibold text-gray-800">{payload[0].payload.fullName}</p>
                        <p className="text-indigo-600 font-bold">{payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="probabilitas" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Probabilitas</h2>
          <div className="space-y-4">
            {results.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{item.diseaseName}</h3>
                  <span className="text-2xl font-bold text-indigo-600">{(item.probability * 100).toFixed(2)}%</span>
                </div>

                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.probability * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 mt-2">Kode: {item.diseaseCode}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-semibold mb-2">Catatan Penting:</p>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>
                  Hasil diagnosis ini bersifat <strong>prediktif</strong> dan bukan diagnosis final.
                </li>
                <li>
                  Sistem menggunakan <strong>Teorema Bayes</strong> dengan metode Forward Chaining untuk analisis.
                </li>
                <li>
                  Segera konsultasi dengan <strong>psikolog atau psikiater berlisensi</strong> untuk diagnosis yang
                  akurat.
                </li>
                <li>Jangan menggunakan hasil ini untuk self-diagnosis atau self-medication.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <Link
            href="/consultation"
            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center font-semibold"
          >
            Konsultasi Lagi
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
