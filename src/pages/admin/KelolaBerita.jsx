import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const KelolaBerita = () => {
  const [activeTab, setActiveTab] = useState("buat");
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    isi: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // State riwayat
  const [beritaList, setBeritaList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // State modal edit
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    judul: "",
    kategori: "",
    isi: "",
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const fetchBerita = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get(
        "https://desa-sembung-be-production.up.railway.app/api/berita",
      );
      setBeritaList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (activeTab === "riwayat") fetchBerita();
  }, [activeTab]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("judul", formData.judul);
    data.append("kategori", formData.kategori);
    data.append("isi", formData.isi);
    data.append("gambar", file);

    try {
      await axios.post(
        "https://desa-sembung-be-production.up.railway.app/api/berita/add",
        data,
      );
      alert("Berita Berhasil Diupload!");
      setFormData({ judul: "", kategori: "", isi: "" });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah berita.");
    }
  };

  // === HAPUS ===
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
    try {
      await axios.delete(
        `https://desa-sembung-be-production.up.railway.app/api/berita/delete/${id}`,
      );
      alert("Berita berhasil dihapus!");
      fetchBerita();
    } catch (err) {
      alert("Gagal menghapus berita.");
    }
  };

  // === BUKA MODAL EDIT ===
  const handleOpenEdit = (berita) => {
    setEditData({
      id: berita.id,
      judul: berita.judul,
      kategori: berita.kategori,
      isi: berita.isi,
      gambar: berita.gambar,
    });
    setEditFile(null);
    setEditPreview(null);
    setEditModal(true);
  };

  // === SIMPAN EDIT ===
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("judul", editData.judul);
    data.append("kategori", editData.kategori);
    data.append("isi", editData.isi);
    if (editFile) data.append("gambar", editFile);

    try {
      await axios.put(
        `https://desa-sembung-be-production.up.railway.app/api/berita/update/${editData.id}`,
        data,
      );
      alert("Berita berhasil diperbarui!");
      setEditModal(false);
      fetchBerita();
    } catch (err) {
      alert("Gagal memperbarui berita.");
    }
  };

  const KATEGORI_OPTIONS = [
    "Pembangunan",
    "Kesehatan",
    "Informasi",
    "Kegiatan",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800 mb-6">
            Kelola Berita Desa
          </h1>

          {/* Tab */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("buat")}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === "buat"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              ✍️ Buat Berita
            </button>
            <button
              onClick={() => setActiveTab("riwayat")}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === "riwayat"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              📋 Riwayat Berita
            </button>
          </div>

          {/* === TAB BUAT BERITA === */}
          {activeTab === "buat" && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm space-y-5 w-full max-w-4xl"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Judul Berita
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul berita yang menarik..."
                  className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none transition"
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData({ ...formData, judul: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none transition bg-white"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  required
                >
                  <option value="">-- Pilih Kategori Berita --</option>
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Foto Berita
                </label>
                <input
                  type="file"
                  className="w-full border-2 border-dashed p-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-full sm:w-auto sm:h-48 rounded-lg shadow-md border object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Isi Berita
                </label>
                <textarea
                  placeholder="Tuliskan isi berita secara detail di sini..."
                  className="w-full border-2 p-3 rounded-xl h-48 sm:h-60 focus:border-blue-500 outline-none transition resize-none"
                  value={formData.isi}
                  onChange={(e) =>
                    setFormData({ ...formData, isi: e.target.value })
                  }
                  required
                />
              </div>

              <button className="w-full bg-blue-600 text-white px-6 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                Terbitkan Berita Sekarang
              </button>
            </form>
          )}

          {/* === TAB RIWAYAT BERITA === */}
          {activeTab === "riwayat" && (
            <div className="w-full max-w-4xl">
              {loadingList ? (
                <div className="text-center py-16 text-gray-400 font-medium">
                  Memuat data berita...
                </div>
              ) : beritaList.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-medium bg-white rounded-2xl shadow-sm">
                  Belum ada berita yang diterbitkan.
                </div>
              ) : (
                <div className="space-y-4">
                  {beritaList.map((berita) => (
                    <div
                      key={berita.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex gap-4 items-start"
                    >
                      {/* Gambar */}
                      <img
                        src={
                          berita.gambar
                            ? berita.gambar.startsWith("http")
                              ? berita.gambar
                              : `https://desa-sembung-be-production.up.railway.app/uploads/berita/${berita.gambar}`
                            : "https://via.placeholder.com/80"
                        }
                        alt={berita.judul}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-1">
                          {berita.kategori}
                        </span>
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-snug line-clamp-2">
                          {berita.judul}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(berita.tgl_posting).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {berita.isi}
                        </p>
                      </div>

                      {/* Aksi */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleOpenEdit(berita)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(berita.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* === MODAL EDIT === */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                ✏️ Edit Berita
              </h2>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Judul Berita
                </label>
                <input
                  type="text"
                  className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none text-sm"
                  value={editData.judul}
                  onChange={(e) =>
                    setEditData({ ...editData, judul: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  className="w-full border-2 p-3 rounded-xl focus:border-blue-500 outline-none bg-white text-sm"
                  value={editData.kategori}
                  onChange={(e) =>
                    setEditData({ ...editData, kategori: e.target.value })
                  }
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Ganti Foto{" "}
                  <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                {/* Preview foto lama */}
                {!editPreview && editData.gambar && (
                  <img
                    src={
                      editData.gambar?.startsWith("http")
                        ? editData.gambar
                        : `https://desa-sembung-be-production.up.railway.app/uploads/berita/${editData.gambar}`
                    }
                    alt="Foto saat ini"
                    className="mb-2 h-32 rounded-xl object-cover border"
                  />
                )}
                {editPreview && (
                  <img
                    src={editPreview}
                    alt="Preview baru"
                    className="mb-2 h-32 rounded-xl object-cover border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border-2 border-dashed p-2 rounded-xl text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setEditFile(f);
                      setEditPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Isi Berita
                </label>
                <textarea
                  className="w-full border-2 p-3 rounded-xl h-40 focus:border-blue-500 outline-none resize-none text-sm"
                  value={editData.isi}
                  onChange={(e) =>
                    setEditData({ ...editData, isi: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaBerita;
