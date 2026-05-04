import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaDownload,
  FaFileAlt,
  FaInfoCircle,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DetailPengajuan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk Aksi Admin
  const [fileHasil, setFileHasil] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchDetail = async () => {
    try {
      const res = await axios.get(
        `https://desa-sembung-be-production.up.railway.app/api/surat/detail/${id}`,
      );
      setDetail(res.data);
    } catch (err) {
      console.error("Gagal mengambil detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // Fungsi Eksekusi Admin (Setuju/Tolak)
  const handleAdminAction = async (status) => {
    if (status === "selesai" && !fileHasil && !detail.file_hasil) {
      return alert("Harap upload file surat yang sudah jadi terlebih dahulu!");
    }
    if (status === "ditolak" && !catatan.trim()) {
      return alert("Harap isi alasan penolakan!");
    }

    const confirmMsg =
      status === "selesai" ? "Setujui pengajuan ini?" : "Tolak pengajuan ini?";

    if (!window.confirm(confirmMsg)) return;

    setIsProcessing(true);
    try {
      // 1. Jika ada file baru, upload dulu
      if (fileHasil) {
        const formData = new FormData();
        formData.append("file", fileHasil);
        await axios.post(
          `https://desa-sembung-be-production.up.railway.app/api/surat/admin/upload-hasil/${id}`,
          formData,
        );
      }

      // 2. Update Status dan Catatan
      await axios.put(
        `https://desa-sembung-be-production.up.railway.app/api/surat/admin/verifikasi/${id}`,
        {
          status,
          catatan: catatan,
        },
      );

      alert(
        `Pengajuan berhasil ${status === "selesai" ? "disetujui" : "ditolak"}.`,
      );
      fetchDetail(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Gagal memproses pengajuan.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500 font-bold animate-pulse">
          Memuat Data Pengajuan...
        </p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold">Data tidak ditemukan.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar role={user.role} />

      <div className="flex-1 md:ml-64 p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition mb-6"
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {/* Header Card */}
          <div className="bg-blue-800 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaFileAlt /> Rincian Pengajuan Surat
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                ID Pengajuan: #{detail.id}
              </p>
            </div>
            <span
              className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                detail.status === "pending"
                  ? "bg-yellow-400 text-yellow-900"
                  : detail.status === "selesai"
                    ? "bg-green-400 text-green-900"
                    : "bg-red-400 text-white"
              }`}
            >
              {detail.status === "pending" ? "Diproses" : detail.status}
            </span>
          </div>

          <div className="p-8">
            {/* Grid Data Pemohon & Surat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section>
                <h3 className="text-blue-800 font-bold border-b pb-2 mb-4 flex items-center gap-2">
                  <FaUser /> Data Pemohon
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 text-sm">Nama Lengkap</span>
                    <span className="font-semibold text-gray-800">
                      {detail.nama_lengkap}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 text-sm">NIK</span>
                    <span className="font-semibold text-gray-800">
                      {detail.nik}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-blue-800 font-bold border-b pb-2 mb-4 flex items-center gap-2">
                  <FaInfoCircle /> Informasi Surat
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 text-sm">Jenis Surat</span>
                    <span className="font-semibold text-blue-600">
                      {detail.nama_surat}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 text-sm">
                      Tanggal Pengajuan
                    </span>
                    <span className="font-semibold text-gray-800">
                      {new Date(detail.tgl_pengajuan).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Keperluan */}
            <div className="mt-8">
              <h3 className="text-gray-700 font-bold mb-2 uppercase text-[10px] tracking-widest">
                Keperluan Pengajuan:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 italic">
                "{detail.keperluan || "Tidak ada keterangan."}"
              </div>
            </div>

            {/* Dokumen Persyaratan */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-gray-700 font-bold mb-3 text-sm">
                Dokumen Persyaratan Warga:
              </h3>
              {detail.path_file ? (
                <a
                  href={
                    detail.path_file?.includes(".pdf")
                      ? detail.path_file.replace(
                          "/image/upload/",
                          "/raw/upload/",
                        )
                      : detail.path_file?.startsWith("http")
                        ? detail.path_file
                        : `https://desa-sembung-be-production.up.railway.app/uploads/${detail.path_file}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition font-bold text-xs"
                >
                  📄 Lihat Berkas Persyaratan
                </a>
              ) : (
                <p className="text-red-500 text-xs italic">
                  Berkas tidak tersedia.
                </p>
              )}
            </div>

            {/* TAMPILAN JIKA SUDAH SELESAI */}
            {detail.status === "selesai" && detail.file_hasil && (
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
                <h3 className="text-green-800 font-bold mb-2 text-sm flex items-center gap-2">
                  <FaCheckCircle /> Surat Telah Terbit:
                </h3>
                <a
                  href={
                    detail.file_hasil?.startsWith("http")
                      ? detail.file_hasil
                      : `https://desa-sembung-be-production.up.railway.app/uploads/${detail.file_hasil}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition font-bold text-xs shadow-sm"
                >
                  <FaDownload /> Unduh Surat Jadi
                </a>
              </div>
            )}

            {/* TAMPILAN JIKA DITOLAK */}
            {detail.status === "ditolak" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <h3 className="text-red-800 font-bold mb-2 text-sm flex items-center gap-2">
                  <FaTimesCircle /> Alasan Penolakan:
                </h3>
                <p className="text-red-700 text-sm italic">
                  "{detail.catatan_penolakan || "Tidak ada catatan."}"
                </p>
              </div>
            )}

            {/* PANEL AKSI ADMIN */}
            {user.role === "admin" && detail.status === "pending" && (
              <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-100">
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-blue-800 font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                      !
                    </span>
                    Panel Verifikasi Admin
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Hasil dengan bingkai putih */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        1. Upload File Surat Jadi (Wajib jika Setuju)
                      </label>
                      <div className="bg-white border border-gray-200 rounded-xl p-2 transition focus-within:ring-2 focus-within:ring-blue-200">
                        <input
                          type="file"
                          onChange={(e) => setFileHasil(e.target.files[0])}
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                      </div>
                      {detail.file_hasil && !fileHasil && (
                        <p className="text-[10px] text-emerald-600 font-bold">
                          ✓ File hasil sudah pernah diupload sebelumnya.
                        </p>
                      )}
                    </div>

                    {/* Alasan Penolakan */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        2. Alasan Penolakan (Wajib jika Tolak)
                      </label>
                      <textarea
                        placeholder="Contoh: Berkas tidak lengkap atau data tidak valid..."
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-200 outline-none transition bg-white"
                        rows="2"
                      />
                    </div>
                  </div>

                  {/* Tombol Eksekusi */}
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      disabled={isProcessing}
                      onClick={() => handleAdminAction("ditolak")}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition"
                    >
                      Tolak Pengajuan
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => handleAdminAction("selesai")}
                      className="px-8 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:bg-gray-400"
                    >
                      {isProcessing ? "Memproses..." : "Setujui & Kirim"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPengajuan;
