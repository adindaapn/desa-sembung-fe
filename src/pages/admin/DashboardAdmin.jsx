import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    selesai: 0,
    ditolak: 0,
  });
  const [suratTerbaru, setSuratTerbaru] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://desa-sembung-be-production.up.railway.app/api/surat/admin/all",
      )
      .then((res) => {
        const data = res.data;
        setStats({
          total: data.length,
          pending: data.filter((i) => i.status === "pending").length,
          selesai: data.filter((i) => i.status === "selesai").length,
          ditolak: data.filter((i) => i.status === "ditolak").length,
        });
        setSuratTerbaru(data.slice(0, 5));
      })
      .catch((err) => console.error("Gagal ambil data dashboard:", err));
  }, []);

  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getStatusBadge = (status) => {
    if (status === "pending")
      return "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200";
    if (status === "selesai")
      return "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200";
    return "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 border border-red-200";
  };

  const getStatusDot = (status) => {
    if (status === "pending") return "bg-amber-400";
    if (status === "selesai") return "bg-emerald-400";
    return "bg-red-400";
  };

  const statCards = [
    {
      label: "Total Masuk",
      value: stats.total,
      icon: "📬",
      color: "text-slate-600",
      bar: "bg-slate-300",
      bg: "bg-slate-50",
    },
    {
      label: "Perlu Diproses", // Ganti dari Perlu Verifikasi
      value: stats.pending,
      icon: "⏳",
      color: "text-amber-600",
      bar: "bg-amber-300",
      bg: "bg-amber-50",
    },
    {
      label: "Selesai",
      value: stats.selesai,
      icon: "✓",
      color: "text-emerald-600",
      bar: "bg-emerald-300",
      bg: "bg-emerald-50",
    },
    {
      label: "Ditolak",
      value: stats.ditolak,
      icon: "✕",
      color: "text-red-500",
      bar: "bg-red-300",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen">
      <Sidebar role="admin" />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1">
                Panel Admin · Desa Sembung
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                Dashboard
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Ringkasan data pengajuan surat terkini
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 mt-1">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Total Pengajuan
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {stats.total} surat
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                A
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide text-gray-400`}
                  >
                    {card.label}
                  </span>
                  <span
                    className={`text-xs font-bold ${card.color} ${card.bg} w-6 h-6 rounded-md flex items-center justify-center`}
                  >
                    {card.icon}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </p>
                <div className="mt-3 h-1 rounded-full bg-gray-100">
                  <div
                    className={`h-1 rounded-full ${card.bar} transition-all duration-500`}
                    style={{
                      width:
                        stats.total > 0
                          ? `${Math.round((card.value / stats.total) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tabel Surat Terbaru */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  Surat Masuk Terbaru
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  5 pengajuan terbaru dari warga
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/riwayat")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
              >
                Lihat Semua →
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Pemohon
                    </th>
                    <th className="py-3 px-5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Jenis Surat
                    </th>
                    <th className="py-3 px-5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Tanggal
                    </th>
                    <th className="py-3 px-5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="py-3 px-5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suratTerbaru.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-14 text-center">
                        <span className="text-3xl block mb-2">📭</span>
                        <p className="text-gray-400 text-sm">
                          Belum ada surat masuk.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    suratTerbaru.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-50 hover:bg-gray-50/70 transition-colors duration-100 ${
                          idx === suratTerbaru.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                              {item.nama_lengkap?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-700 text-sm">
                              {item.nama_lengkap}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-gray-500 text-sm">
                          {item.nama_surat}
                        </td>
                        <td className="py-3.5 px-5 text-gray-400 text-xs">
                          {formatTanggal(item.tgl_pengajuan)}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={getStatusBadge(item.status)}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`}
                            />
                            {/* Ubah teks tampilan dari Pending ke Diproses */}
                            {item.status === "pending"
                              ? "Diproses"
                              : item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button
                            onClick={() =>
                              navigate(`/admin/surat/detail/${item.id}`)
                            }
                            className="text-xs font-semibold text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Info */}
            {suratTerbaru.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {suratTerbaru.length} dari {stats.total} pengajuan
                </p>
                <p className="text-xs text-gray-300">Desa Sembung © 2026</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
