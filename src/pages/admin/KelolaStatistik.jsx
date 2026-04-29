import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaDungeon,
  FaEdit,
  FaHome,
  FaMapMarkedAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

const KelolaStatistik = () => {
  const [stats, setStats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://desa-sembung-be-production.up.railway.app/api/statistik",
      );
      setStats(res.data);
    } catch (err) {
      console.error("Gagal mengambil data statistik", err);
    }
  };

  const getIcon = (label) => {
    switch (label.toLowerCase()) {
      case "total penduduk":
        return <FaUsers className="text-blue-500" />;
      case "kepala keluarga":
        return <FaHome className="text-green-500" />;
      case "luas wilayah":
        return <FaMapMarkedAlt className="text-orange-500" />;
      case "dusun":
        return <FaDungeon className="text-purple-500" />;
      default:
        return <FaEdit className="text-gray-500" />;
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTempValue(item.value);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `https://desa-sembung-be-production.up.railway.app/api/statistik/${id}`,
        {
          value: tempValue,
        },
      );
      setEditingId(null);
      fetchStats();
    } catch (err) {
      alert("Gagal memperbarui data");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800 flex items-center gap-3">
              <span className="bg-blue-600 text-white p-2 rounded-lg shadow-lg text-base sm:text-xl">
                📊
              </span>
              Kelola Statistik Desa
            </h1>
            <p className="text-gray-500 mt-2 ml-12 text-sm sm:text-base">
              Perbarui data statistik desa secara berkala untuk transparansi
              informasi publik.
            </p>
          </div>

          {/* GRID KARTU STATISTIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl">
            {stats.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-2 transition-all duration-300 ${
                  editingId === item.id
                    ? "border-blue-500 ring-4 ring-blue-50"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl p-2 sm:p-3 bg-gray-50 rounded-xl flex-shrink-0">
                      {getIcon(item.label)}
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {item.label}
                      </h2>
                      {editingId !== item.id && (
                        <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>

                  {editingId !== item.id && (
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-colors text-sm flex-shrink-0"
                    >
                      <FaEdit size={13} /> Edit
                    </button>
                  )}
                </div>

                {editingId === item.id && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      className="w-full p-3 sm:p-4 border-2 border-blue-200 rounded-xl outline-none font-bold text-gray-700 text-lg sm:text-xl focus:border-blue-500 bg-white"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSave(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-green-700 shadow-md active:scale-95 transition text-sm sm:text-base"
                      >
                        <FaCheck /> Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-600 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-gray-300 transition text-sm sm:text-base"
                      >
                        <FaTimes /> Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaStatistik;
