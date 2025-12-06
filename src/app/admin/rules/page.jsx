"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    diseaseId: "",
    symptomId: "",
    probability: "",
  });

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
        const error = await response.json();
        alert(error.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error saving rule:", error);
      alert("Terjadi kesalahan");
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

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus aturan ini?")) return;

    try {
      const response = await fetch(`/api/rules/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        alert("Aturan berhasil dihapus");
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert("Terjadi kesalahan");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRule(null);
    setFormData({ diseaseId: "", symptomId: "", probability: "" });
  };

  const filteredRules = rules.filter(
    (rule) =>
      rule.disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group rules by disease
  const groupedRules = filteredRules.reduce((acc, rule) => {
    const diseaseName = rule.disease.name;
    if (!acc[diseaseName]) {
      acc[diseaseName] = [];
    }
    acc[diseaseName].push(rule);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Kelola Aturan</h2>
          <p className="text-gray-600 mt-1">Kelola basis aturan (rule base) P(Gejala|Penyakit)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Aturan
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari aturan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grouped Tables */}
      <div className="space-y-6">
        {Object.keys(groupedRules).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            Tidak ada data aturan
          </div>
        ) : (
          Object.entries(groupedRules).map(([diseaseName, diseaseRules]) => (
            <div key={diseaseName} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-indigo-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-indigo-900">{diseaseName}</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kode Gejala
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Gejala
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P(Gejala|Penyakit)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {diseaseRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{rule.symptom.code}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{rule.symptom.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {rule.probability.toFixed(2)} ({(rule.probability * 100).toFixed(0)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(rule)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="w-5 h-5 inline" />
                          </button>
                          <button onClick={() => handleDelete(rule.id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-5 h-5 inline" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">{editingRule ? "Edit Aturan" : "Tambah Aturan"}</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penyakit *</label>
                <select
                  required
                  value={formData.diseaseId}
                  onChange={(e) => setFormData({ ...formData, diseaseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={editingRule}
                >
                  <option value="">Pilih Penyakit</option>
                  {diseases.map((disease) => (
                    <option key={disease.id} value={disease.id}>
                      {disease.code} - {disease.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gejala *</label>
                <select
                  required
                  value={formData.symptomId}
                  onChange={(e) => setFormData({ ...formData, symptomId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={editingRule}
                >
                  <option value="">Pilih Gejala</option>
                  {symptoms.map((symptom) => (
                    <option key={symptom.id} value={symptom.id}>
                      {symptom.code} - {symptom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probabilitas (0.0 - 1.0) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contoh: 0.8"
                />
                <p className="text-xs text-gray-500 mt-1">Contoh: 0.8 = 80%, 0.5 = 50%</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingRule ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
