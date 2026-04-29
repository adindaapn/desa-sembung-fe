import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const DashboardWarga = () => {
  const navigate = useNavigate();

  const [user] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [riwayat, setRiwayat] = useState([]);

  // Filter state
  const [filterJenis, setFilterJenis] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`https://desa-sembung-be.vercel.app/api/surat/user/${user.id}`)
        .then((res) => setRiwayat(res.data))
        .catch((err) => console.error("Gagal ambil data:", err));
    }
  }, [user]);

  const handleDownload = async (fileName, originalName) => {
    try {
      const response = await fetch(
        `https://desa-sembung-be.vercel.app/uploads/${fileName}`,
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Surat_${originalName.replace(/\s+/g, "_")}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Terjadi kesalahan saat mengunduh file.");
    }
  };

  const pending = riwayat.filter((i) => i.status === "pending").length;
  const selesai = riwayat.filter((i) => i.status === "selesai").length;
  const ditolak = riwayat.filter((i) => i.status === "ditolak").length;

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
      label: "Surat Diproses", // Diubah dari Surat Pending
      value: pending,
      color: "text-amber-600",
      bar: "bg-amber-300",
      bg: "bg-amber-50",
      icon: "⏳",
    },
    {
      label: "Surat Selesai",
      value: selesai,
      color: "text-emerald-600",
      bar: "bg-emerald-300",
      bg: "bg-emerald-50",
      icon: "✓",
    },
    {
      label: "Ditolak",
      value: ditolak,
      color: "text-red-500",
      bar: "bg-red-300",
      bg: "bg-red-50",
      icon: "✕",
    },
  ];

  const nama = user.nama_lengkap || user.nama || "Warga";

  // Opsi jenis surat unik dari data
  const jenisOptions = useMemo(() => {
    const all = riwayat.map((i) => i.nama_surat).filter(Boolean);
    return [...new Set(all)].sort();
  }, [riwayat]);

  // Opsi bulan unik dari data
  const bulanOptions = useMemo(() => {
    const all = riwayat.map((i) => {
      const d = new Date(i.tgl_pengajuan);
      return {
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }),
      };
    });
    const seen = new Set();
    return all
      .filter((b) => {
        if (seen.has(b.value)) return false;
        seen.add(b.value);
        return true;
      })
      .sort((a, b) => b.value.localeCompare(a.value));
  }, [riwayat]);

  // Data setelah filter
  const filtered = useMemo(() => {
    return riwayat.filter((item) => {
      const cocokJenis = filterJenis ? item.nama_surat === filterJenis : true;
      const cocokStatus = filterStatus ? item.status === filterStatus : true;
      const cocokBulan = filterBulan
        ? (() => {
            const d = new Date(item.tgl_pengajuan);
            const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return val === filterBulan;
          })()
        : true;
      return cocokJenis && cocokStatus && cocokBulan;
    });
  }, [riwayat, filterJenis, filterBulan, filterStatus]);

  const hasFilter = filterJenis || filterBulan || filterStatus;

  const resetFilter = () => {
    setFilterJenis("");
    setFilterBulan("");
    setFilterStatus("");
  };

  const TableRow = ({ item, idx, total }) => (
    <tr
      className={`border-b border-gray-50 hover:bg-gray-50/70 transition-colors duration-100 ${idx === total - 1 ? "border-b-0" : ""}`}
    >
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-xs flex-shrink-0">
            📋
          </div>
          <span className="font-medium text-gray-700 text-sm">
            {item.nama_surat}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-5 text-gray-400 text-xs">
        {formatTanggal(item.tgl_pengajuan)}
      </td>
      <td className="py-3.5 px-5">
        <span className={getStatusBadge(item.status)}>
          <span
            className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`}
          />
          {/* Diubah: jika pending tampilkan 'Diproses', selain itu format biasa */}
          {item.status === "pending"
            ? "Diproses"
            : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      </td>
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/surat/detail/${item.id}`)}
            className="text-xs font-semibold text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition"
          >
            Detail
          </button>
          {item.status === "selesai" && item.file_hasil ? (
            <button
              onClick={() => handleDownload(item.file_hasil, item.nama_surat)}
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition active:scale-95"
            >
              Download
            </button>
          ) : item.status === "pending" ? (
            <span className="text-xs font-medium text-amber-500 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              Diproses
            </span>
          ) : (
            <span className="text-xs font-medium text-red-400 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
              Ditolak
            </span>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen">
      <Sidebar role="warga" />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1">
                Panel Warga · Desa Sembung
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                Selamat Datang, {nama}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Berikut ringkasan pengajuan surat Anda
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 mt-1">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  NIK
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {user.nik || "-"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {nama.charAt(0).toUpperCase()}
              </div>
            </div>
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

          {/* Tabel Riwayat */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header tabel */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  Riwayat Pengajuan Surat
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Semua pengajuan surat yang pernah dibuat
                </p>
              </div>
              <button
                onClick={() => navigate("/warga/ajukan")}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
              >
                + Ajukan
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex flex-wrap gap-2 items-center">
              {/* Filter Jenis Surat */}
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 outline-none focus:border-blue-400 cursor-pointer"
              >
                <option value="">Semua Jenis Surat</option>
                {jenisOptions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>

              {/* Filter Bulan */}
              <select
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 outline-none focus:border-blue-400 cursor-pointer"
              >
                <option value="">Semua Bulan</option>
                {bulanOptions.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 outline-none focus:border-blue-400 cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="pending">Diproses</option>{" "}
                {/* Diubah dari Pending */}
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>

              {/* Reset Filter */}
              {hasFilter && (
                <button
                  onClick={resetFilter}
                  className="text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 bg-white px-3 py-1.5 rounded-lg transition"
                >
                  ✕ Reset Filter
                </button>
              )}

              {/* Info hasil filter */}
              {hasFilter && (
                <span className="text-xs text-gray-400 ml-auto">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-600">
                    {filtered.length}
                  </span>{" "}
                  dari {riwayat.length} data
                </span>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center gap-2">
                  <span className="text-3xl">🔍</span>
                  <p className="text-gray-400 text-sm">
                    Tidak ada data yang sesuai filter.
                  </p>
                  {hasFilter && (
                    <button
                      onClick={resetFilter}
                      className="text-xs text-blue-500 underline mt-1"
                    >
                      Reset filter
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 text-sm">
                        {item.nama_surat}
                      </span>
                      <span className={getStatusBadge(item.status)}>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`}
                        />
                        {/* Diubah: jika pending tampilkan 'Diproses' */}
                        {item.status === "pending"
                          ? "Diproses"
                          : item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatTanggal(item.tgl_pengajuan)}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => navigate(`/surat/detail/${item.id}`)}
                        className="flex-1 text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 py-1.5 rounded-lg transition"
                      >
                        Detail
                      </button>
                      {item.status === "selesai" && item.file_hasil ? (
                        <button
                          onClick={() =>
                            handleDownload(item.file_hasil, item.nama_surat)
                          }
                          className="flex-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 py-1.5 rounded-lg transition"
                        >
                          Download
                        </button>
                      ) : item.status === "pending" ? (
                        <span className="flex-1 text-xs font-medium text-amber-500 bg-amber-50 py-1.5 rounded-lg text-center">
                          Diproses
                        </span>
                      ) : (
                        <span className="flex-1 text-xs font-medium text-red-400 bg-red-50 py-1.5 rounded-lg text-center">
                          Ditolak
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Jenis Surat", "Tanggal", "Status", "Aksi"].map((h) => (
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-16 text-center">
                        <span className="text-3xl block mb-2">🔍</span>
                        <p className="text-gray-400 text-sm">
                          Tidak ada data yang sesuai filter.
                        </p>
                        {hasFilter && (
                          <button
                            onClick={resetFilter}
                            className="text-xs text-blue-500 underline mt-2"
                          >
                            Reset filter
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <TableRow
                        key={item.id}
                        item={item}
                        idx={idx}
                        total={filtered.length}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {riwayat.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {hasFilter
                    ? `${filtered.length} dari ${riwayat.length} pengajuan`
                    : `${riwayat.length} pengajuan`}
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

export default DashboardWarga;
