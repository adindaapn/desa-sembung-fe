import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const RiwayatSurat = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentDate = new Date();
  const [bulan, setBulan] = useState(currentDate.getMonth() + 1);
  const [tahun, setTahun] = useState(currentDate.getFullYear());
  const [statusFilter, setStatusFilter] = useState("semua");

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  useEffect(() => {
    fetchData();
  }, [bulan, tahun, statusFilter]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(
        "https://desa-sembung-be-production.up.railway.app/api/surat/admin/riwayat",
        {
          params: { bulan, tahun, status: statusFilter },
        },
      )
      .then((res) => {
        setRiwayat(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
        setLoading(false);
      });
  };

  const totalSelesai = riwayat.filter((i) => i.status === "selesai").length;
  const totalDitolak = riwayat.filter((i) => i.status === "ditolak").length;

  const formatTanggal = (tgl) =>
    new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getStatusBadge = (status) =>
    status === "selesai"
      ? "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200"
      : "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 border border-red-200";

  const statCards = [
    {
      label: "Total Riwayat Surat",
      value: riwayat.length,
      color: "text-slate-600",
      bar: "bg-slate-300",
      bg: "bg-slate-50",
      icon: "📋",
    },
    {
      label: "Selesai",
      value: totalSelesai,
      color: "text-emerald-600",
      bar: "bg-emerald-300",
      bg: "bg-emerald-50",
      icon: "✓",
    },
    {
      label: "Ditolak",
      value: totalDitolak,
      color: "text-red-500",
      bar: "bg-red-300",
      bg: "bg-red-50",
      icon: "✕",
    },
  ];

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen">
      <Sidebar role="admin" />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-7">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1">
              Panel Admin · Desa Sembung
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
              Riwayat Surat Terverifikasi
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Periode: {namaBulan[bulan - 1]} {tahun}
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
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
                        riwayat.length > 0
                          ? `${Math.round((card.value / riwayat.length) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold text-gray-700">
                Filter Riwayat
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: "Bulan",
                  value: bulan,
                  onChange: (e) => setBulan(e.target.value),
                  options: namaBulan.map((nama, i) => ({
                    value: i + 1,
                    label: nama,
                  })),
                },
                {
                  label: "Tahun",
                  value: tahun,
                  onChange: (e) => setTahun(e.target.value),
                  options: [2024, 2025, 2026, 2027, 2028].map((y) => ({
                    value: y,
                    label: y,
                  })),
                },
                {
                  label: "Status",
                  value: statusFilter,
                  onChange: (e) => setStatusFilter(e.target.value),
                  options: [
                    { value: "semua", label: "Semua Status" },
                    { value: "selesai", label: "Selesai" },
                    { value: "ditolak", label: "Ditolak" },
                  ],
                },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                    {f.label}
                  </label>
                  <select
                    value={f.value}
                    onChange={f.onChange}
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                  >
                    {f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Tabel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  Data Riwayat — {namaBulan[bulan - 1]} {tahun}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {riwayat.length} data ditemukan
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-sm animate-pulse">
                  Memuat data...
                </p>
              </div>
            ) : riwayat.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <span className="text-4xl">📭</span>
                <p className="text-gray-500 font-medium text-sm">
                  Tidak ada riwayat surat untuk periode ini.
                </p>
                <p className="text-gray-400 text-xs">
                  Coba ubah filter bulan atau tahun.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-gray-50">
                  {riwayat.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                            {item.nama_lengkap?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">
                            {item.nama_lengkap}
                          </span>
                        </div>
                        <span className={getStatusBadge(item.status)}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.status === "selesai" ? "bg-emerald-400" : "bg-red-400"}`}
                          />
                          {item.status === "selesai" ? "Selesai" : "Ditolak"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">
                        {item.nik}
                      </p>
                      <p className="text-sm text-gray-600">{item.nama_surat}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {formatTanggal(item.tgl_pengajuan)}
                        </p>
                        <div className="flex gap-2">
                          {item.path_file && (
                            <a
                              href={
                                item.path_file?.startsWith("http")
                                  ? item.path_file
                                  : "https://desa-sembung-be-production.up.railway.app/uploads/" +
                                    item.path_file
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition"
                            >
                              Berkas
                            </a>
                          )}
                          {item.status === "selesai" && item.file_hasil && (
                            <a
                              href={
                                item.file_hasil?.startsWith("http")
                                  ? item.file_hasil
                                  : "https://desa-sembung-be-production.up.railway.app/uploads/" +
                                    item.file_hasil
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition"
                            >
                              Surat
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {[
                          "No",
                          "Nama Pemohon",
                          "NIK",
                          "Jenis Surat",
                          "Tanggal",
                          "Status",
                          "Aksi",
                        ].map((h) => (
                          <th
                            key={h}
                            className="py-3 px-5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {riwayat.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b border-gray-50 hover:bg-gray-50/70 transition-colors duration-100 ${index === riwayat.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="py-3.5 px-5 text-gray-400 text-xs font-medium">
                            {String(index + 1).padStart(2, "0")}
                          </td>
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
                          <td className="py-3.5 px-5 text-gray-400 text-xs font-mono">
                            {item.nik}
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
                                className={`w-1.5 h-1.5 rounded-full ${item.status === "selesai" ? "bg-emerald-400" : "bg-red-400"}`}
                              />
                              {item.status === "selesai"
                                ? "Selesai"
                                : "Ditolak"}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2">
                              {item.path_file && (
                                <a
                                  href={
                                    item.path_file?.startsWith("http")
                                      ? item.path_file
                                      : "https://desa-sembung-be-production.up.railway.app/uploads/" +
                                        item.path_file
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                                >
                                  Berkas
                                </a>
                              )}
                              {item.status === "selesai" && item.file_hasil && (
                                <a
                                  href={
                                    item.file_hasil?.startsWith("http")
                                      ? item.file_hasil
                                      : "https://desa-sembung-be-production.up.railway.app/uploads/" +
                                        item.file_hasil
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-semibold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition"
                                >
                                  Surat
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {riwayat.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {riwayat.length} data — {namaBulan[bulan - 1]} {tahun}
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

export default RiwayatSurat;
