"use client";

import { useEffect, useState } from "react";
import { Stethoscope, Activity, BookOpen, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    diseases: 0,
    symptoms: 0,
    rules: 0,
    consultations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [diseasesRes, symptomsRes, rulesRes, consultationsRes] = await Promise.all([
        fetch("/api/diseases"),
        fetch("/api/symptoms"),
        fetch("/api/rules"),
        fetch("/api/consultations"),
      ]);

      const diseases = await diseasesRes.json();
      const symptoms = await symptomsRes.json();
      const rules = await rulesRes.json();
      const consultations = await consultationsRes.json();

      setStats({
        diseases: diseases.length,
        symptoms: symptoms.length,
        rules: rules.length,
        consultations: consultations.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Penyakit",
      value: stats.diseases,
      icon: Stethoscope,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Gejala",
      value: stats.symptoms,
      icon: Activity,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Aturan",
      value: stats.rules,
      icon: BookOpen,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Konsultasi",
      value: stats.consultations,
      icon: Users,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">Selamat datang di panel admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tentang Sistem</h3>
        <div className="space-y-3 text-gray-600">
          <p>
            Sistem Pakar Diagnosis Penyakit Mental menggunakan <strong>Teorema Bayes</strong> untuk menghitung
            probabilitas penyakit berdasarkan gejala yang dialami pasien.
          </p>
          <p>
            Metode ini mengikuti pendekatan yang sama dengan jurnal Sistem Pakar Pendiagnosaan Dermatitis Imun
            Menggunakan Teorema Bayes dengan tahapan:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>
              <strong>Forward Chaining:</strong> Identifikasi penyakit yang relevan berdasarkan gejala
            </li>
            <li>
              <strong>Teorema Bayes:</strong> Hitung probabilitas untuk setiap penyakit yang teridentifikasi
            </li>
            <li>
              <strong>Ranking:</strong> Urutkan hasil berdasarkan probabilitas tertinggi
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
