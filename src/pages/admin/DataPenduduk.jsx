import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const DataPenduduk = () => {
  const [penduduk, setPenduduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://desa-sembung-be-production.up.railway.app/api/auth/warga",
      );
      setPenduduk(res.data);
    } catch (err) {
      console.error("Gagal ambil data penduduk:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = penduduk.filter(
    (item) =>
      item.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search),
  );

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen">
      <Sidebar role="admin" />
      <div className="flex-1 md:ml-64 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-7">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Panel Admin · Desa Sembung
            </p>
            <h1 className="text-2xl font-bold text-gray-800">
              Data Penduduk Terdaftar
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Total warga terdaftar di sistem: {penduduk.length} orang
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-sm font-bold text-gray-800">Daftar Warga</h2>
              <input
                type="text"
                placeholder="Cari Nama atau NIK..."
                className="text-xs border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-64 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-400 animate-pulse">
                Memuat data penduduk...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["No", "Nama Lengkap", "NIK", "Email", "No. HP"].map(
                        (h) => (
                          <th
                            key={h}
                            className="py-3 px-5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((user, idx) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-50 hover:bg-gray-50/70 transition"
                      >
                        <td className="py-4 px-5 text-xs text-gray-400">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                              {user.nama_lengkap.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-700">
                              {user.nama_lengkap}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-gray-500 font-mono text-xs">
                          {user.nik}
                        </td>
                        <td className="py-4 px-5 text-gray-500">
                          {user.email}
                        </td>
                        <td className="py-4 px-5 text-gray-500">
                          {user.no_hp || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPenduduk;
