"use client";

import Link from "next/link";
import { Brain, Stethoscope, ChartBar, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">MentalHealth AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/consultation" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Konsultasi
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistem Pakar Diagnosis
            <span className="text-indigo-600"> Penyakit Mental</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Deteksi dini penyakit mental berdasarkan gejala menggunakan metode Teorema Bayes. Konsultasi gratis dan
            hasil instan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
            >
              Mulai Konsultasi
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-lg font-semibold"
            >
              Cara Kerja
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Diagnosis Akurat</h3>
            <p className="text-gray-600">
              Menggunakan Teorema Bayes untuk menghasilkan diagnosis dengan tingkat akurasi tinggi berdasarkan gejala
              yang dialami.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <ChartBar className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hasil Probabilitas</h3>
            <p className="text-gray-600">
              Menampilkan probabilitas setiap penyakit dalam bentuk persentase yang mudah dipahami dan divisualisasikan.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aman & Privat</h3>
            <p className="text-gray-600">
              Data konsultasi Anda tersimpan dengan aman. Hasil dapat digunakan sebagai rujukan awal sebelum konsultasi
              profesional.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cara Kerja Sistem</h2>
            <p className="text-xl text-gray-600">Proses diagnosis menggunakan 3 tahapan utama</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pilih Gejala</h3>
              <p className="text-gray-600">
                Masukkan data diri dan pilih gejala-gejala yang sedang Anda alami dari daftar yang tersedia.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analisis Bayes</h3>
              <p className="text-gray-600">
                Sistem menggunakan Forward Chaining dan Teorema Bayes untuk menghitung probabilitas setiap penyakit.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hasil Diagnosis</h3>
              <p className="text-gray-600">
                Dapatkan hasil berupa probabilitas penyakit yang diurutkan dari tertinggi ke terendah dengan
                visualisasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Disclaimer Penting
          </h3>
          <div className="text-yellow-800 space-y-2">
            <p>
              ⚠️ Sistem ini hanya untuk tujuan <strong>edukasi dan skrining awal</strong>. Hasil diagnosis tidak dapat
              menggantikan konsultasi dengan profesional kesehatan mental.
            </p>
            <p>
              ✅ Jika Anda mengalami gejala yang mengganggu, segera konsultasikan dengan psikolog atau psikiater
              berlisensi.
            </p>
            <p>
              📞 <strong>Darurat:</strong> Hubungi 119 (ext. 8) atau layanan kesehatan mental terdekat jika Anda
              memiliki pikiran untuk menyakiti diri sendiri.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 MentalHealth AI - Sistem Pakar Diagnosis Penyakit Mental</p>
          <p className="text-gray-500 text-sm mt-2">Menggunakan Teorema Bayes untuk analisis probabilitas</p>
        </div>
      </footer>
    </div>
  );
}
