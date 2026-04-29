import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const AjukanSurat = () => {
  const navigate = useNavigate();

  const [jenisSuratList, setJenisSuratList] = useState([]);
  const [jenisSuratId, setJenisSuratId] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/surat/jenis")
      .then((res) => setJenisSuratList(res.data))
      .catch((err) => console.error("Gagal ambil jenis surat:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jenisSuratId || !file) {
      alert("Harap pilih jenis surat dan upload berkas!");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("jenis_surat_id", jenisSuratId);
    formData.append("keperluan", keperluan);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/surat/ajukan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Sukses! Pengajuan surat berhasil dikirim.");
      navigate("/warga/dashboard");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim pengajuan. Pastikan semua kolom terisi.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar role="warga" />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase mt-6">
            Panel Warga — Desa Sembung
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Formulir Pengajuan Surat
          </h1>
        </div>

        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Jenis Surat */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Jenis Surat
              </label>
              <select
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base bg-white"
                value={jenisSuratId}
                onChange={(e) => setJenisSuratId(e.target.value)}
              >
                <option value="">-- Pilih Surat --</option>
                {jenisSuratList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama_surat} ({item.syarat_dokumen})
                  </option>
                ))}
              </select>
            </div>

            {/* Upload File */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Upload Berkas Persyaratan
              </label>
              <div className="border-2 border-dashed border-gray-300 p-5 md:p-6 rounded-xl text-center hover:bg-gray-50 transition">
                <input
                  type="file"
                  className="w-full text-sm"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {file && (
                  <p className="text-xs text-blue-600 mt-2 font-medium truncate">
                    ✓ {file.name}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Maksimal 2MB (PDF/JPG/PNG)
                </p>
              </div>
            </div>

            {/* Keperluan */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Keperluan / Keterangan
              </label>
              <textarea
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base resize-none"
                placeholder="Tuliskan alasan atau keperluan pengajuan surat ini..."
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
              ></textarea>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 md:gap-4 pt-1">
              <button
                type="button"
                onClick={() => navigate("/warga/dashboard")}
                className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-sm md:text-base"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-2/3 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition text-sm md:text-base"
              >
                Kirim Pengajuan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjukanSurat;
