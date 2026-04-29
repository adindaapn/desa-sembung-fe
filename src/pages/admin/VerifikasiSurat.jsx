import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const VerifikasiSurat = () => {
  const navigate = useNavigate();
  const [suratMasuk, setSuratMasuk] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://desa-sembung-be.vercel.app/api/surat/admin/list")
      .then((res) => setSuratMasuk(res.data))
      .catch((err) => console.error("Gagal ambil data:", err));
  };

  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen">
      <Sidebar role="admin" />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0 p-6 lg:p-10">
        {/* Header */}
        <header className="mb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Panel Admin — Desa Sembung
          </p>
          <h1 className="text-2xl font-bold text-gray-800">
            Verifikasi Surat Masuk
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {suratMasuk.length} pengajuan perlu ditinjau dan diproses
          </p>
        </header>

        {suratMasuk.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
            <span className="text-4xl block mb-3">✅</span>
            <p className="text-gray-500 font-medium">
              Semua pengajuan telah diproses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {suratMasuk.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                  {/* Bagian Kiri: Identitas Pemohon */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm text-lg">
                      {item.nama_lengkap?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">
                        {item.nama_lengkap}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                          {item.nama_surat}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatTanggal(item.tgl_pengajuan)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bagian Kanan: Tombol Navigasi ke Detail */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right mr-2">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-1">
                        Status
                      </p>
                      <span className="text-xs font-bold text-amber-600">
                        MENUNGGU VERIFIKASI
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/surat/detail/${item.id}`)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-bold text-sm shadow-lg shadow-blue-100"
                    >
                      🔍 Periksa & Proses
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifikasiSurat;
