"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Info, Grid, List } from "lucide-react";

export default function RulesPage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("matrix"); // 'matrix' or 'rules'
  const [rules, setRules] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    diseaseId: "",
    symptomId: "",
    probability: "",
  });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rulesRes, diseasesRes, symptomsRes] = await Promise.all([
        fetch("/api/rules"),
        fetch("/api/diseases"),
        fetch("/api/symptoms"),
      ]);

      const rulesData = await rulesRes.json();
      const diseasesData = await diseasesRes.json();
      const symptomsData = await symptomsRes.json();

      setRules(rulesData);
      setDiseases(diseasesData);
      setSymptoms(symptomsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD OPERATIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const prob = parseFloat(formData.probability);
    if (prob < 0 || prob > 1) {
      alert("Probabilitas harus antara 0 dan 1");
      return;
    }

    try {
      const url = editingRule ? `/api/rules/${editingRule.id}` : "/api/rules";
      const method = editingRule ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        closeModal();
        alert(editingRule ? "Aturan berhasil diupdate" : "Aturan berhasil ditambahkan");
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error saving rule:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus aturan ini?")) return;
    try {
      const response = await fetch(`/api/rules/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchData();
        alert("Aturan berhasil dihapus");
      } else {
        const data = await response.json();
        alert(data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      diseaseId: rule.diseaseId,
      symptomId: rule.symptomId,
      probability: rule.probability.toString(),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRule(null);
    setFormData({ diseaseId: "", symptomId: "", probability: "" });
  };

  // --- HELPERS ---
  const getRuleProbability = (symptomId, diseaseId) => {
    const rule = rules.find(
      (r) =>
        (r.symptomId === symptomId || r.symptom.id === symptomId) &&
        (r.diseaseId === diseaseId || r.disease.id === diseaseId)
    );
    return rule ? rule.probability : "-";
  };

  // Group rules by Disease for the "Rules Tab"
  const groupedRules = rules.reduce((acc, rule) => {
    const diseaseName = rule.disease.name;
    const diseaseCode = rule.disease.code;
    const key = `${diseaseCode} - ${diseaseName}`; // Unique key

    if (!acc[key]) {
      acc[key] = {
        diseaseName: diseaseName,
        diseaseCode: diseaseCode,
        items: [],
      };
    }
    acc[key].items.push(rule);
    return acc;
  }, {});

  // Generate Forward Chaining String: "IF G01 AND G02 ... THEN P01"
  const generateForwardChainingText = (rulesList, diseaseName) => {
    if (!rulesList || rulesList.length === 0) return "Tidak ada aturan.";
    const conditions = rulesList.map((r) => r.symptom.code).join(" AND ");
    return `IF (${conditions}) THEN ${diseaseName}`;
  };

  if (loading) return <div className="p-8 text-center">Loading data...</div>;

  return (
    <div className="space-y-6 pb-10 min-h-screen bg-gray-50 p-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Basis Pengetahuan</h2>
          <p className="text-gray-600 mt-1">Kelola aturan diagnosa sistem pakar</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Aturan
        </button>
      </div>

      {/* --- TABS NAVIGATION --- */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === "matrix"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <Grid className="w-4 h-4" />
            Matriks Probabilitas
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === "rules"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <List className="w-4 h-4" />
            Tabel Aturan & Penyakit
          </button>
        </nav>
      </div>

      {/* --- TAB CONTENT 1: MATRIKS VIEW --- */}
      {activeTab === "matrix" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Legend / Informasi Kode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daftar Penyakit */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> Kode Penyakit (Kolom)
              </h4>
              <div className="h-32 overflow-y-auto text-sm space-y-1">
                {diseases.map((d) => (
                  <div key={d.id} className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-mono font-bold text-indigo-600">{d.code}</span>
                    <span className="text-gray-600 truncate ml-2">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daftar Gejala */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> Kode Gejala (Baris)
              </h4>
              <div className="h-32 overflow-y-auto text-sm space-y-1">
                {symptoms.map((s) => (
                  <div key={s.id} className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-mono font-bold text-indigo-600">{s.code}</span>
                    <span className="text-gray-600 truncate ml-2">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabel Matriks */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-gray-600 border-r border-gray-200">Gejala\Penyakit</th>
                    {diseases.map((disease) => (
                      <th key={disease.id} className="px-4 py-3 font-bold text-indigo-700" title={disease.name}>
                        {disease.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {symptoms.map((symptom, index) => (
                    <tr key={symptom.id} className="hover:bg-gray-50">
                      <td
                        className="px-4 py-3 font-mono font-medium text-gray-800 border-r border-gray-200"
                        title={symptom.name}
                      >
                        {symptom.code}
                      </td>
                      {diseases.map((disease) => {
                        const prob = getRuleProbability(symptom.id, disease.id);
                        return (
                          <td key={disease.id} className="px-4 py-3">
                            {prob !== "-" ? (
                              <span className="inline-block px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                                {prob}
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 2: TABEL ATURAN (FORWARD CHAINING) --- */}
      {activeTab === "rules" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari Penyakit atau Gejala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* List Per Penyakit */}
          <div className="grid grid-cols-1 gap-8">
            {Object.keys(groupedRules).length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                Belum ada aturan yang dibuat.
              </div>
            ) : (
              Object.entries(groupedRules)
                .filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(([key, data]) => (
                  <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Penyakit & Logika Forward Chaining */}
                    <div className="bg-indigo-50/50 p-6 border-b border-indigo-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{data.diseaseName}</h3>
                          <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                            {data.diseaseCode}
                          </span>
                        </div>
                      </div>

                      {/* Logika Forward Chaining yang diminta */}
                      <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                        <p className="text-sm font-mono text-gray-700 wrap-break-words leading-relaxed">
                          <span className="font-bold text-indigo-600 block mb-1 text-xs uppercase tracking-wide">
                            Logika Forward Chaining:
                          </span>
                          {generateForwardChainingText(data.items, data.diseaseName)}
                        </p>
                      </div>
                    </div>

                    {/* Tabel Rincian */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kode Gejala</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nama Gejala</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                              Nilai Probabilitas
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {data.items.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50">
                              <td className="px-6 py-3">
                                <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  {rule.symptom.code}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm text-gray-800">{rule.symptom.name}</td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-indigo-600">{rule.probability}</span>
                                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-indigo-500 h-1.5 rounded-full"
                                      style={{ width: `${rule.probability * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <button
                                  onClick={() => handleEdit(rule)}
                                  className="text-indigo-600 hover:text-indigo-800 mr-3"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(rule.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* --- MODAL (TIDAK BERUBAH) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{editingRule ? "Edit Aturan" : "Tambah Aturan"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penyakit</label>
                <select
                  required
                  value={formData.diseaseId}
                  onChange={(e) => setFormData({ ...formData, diseaseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={editingRule}
                >
                  <option value="">Pilih Penyakit</option>
                  {diseases.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gejala</label>
                <select
                  required
                  value={formData.symptomId}
                  onChange={(e) => setFormData({ ...formData, symptomId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={editingRule}
                >
                  <option value="">Pilih Gejala</option>
                  {symptoms.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probabilitas (0.0 - 1.0)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
