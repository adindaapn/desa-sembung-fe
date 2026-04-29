import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const KelolaAgenda = () => {
  const [agenda, setAgenda] = useState([]);
  const [form, setForm] = useState({
    nama_kegiatan: "",
    tanggal: "",
    waktu: "",
    lokasi: "",
    keterangan: "",
  });

  const fetchAgenda = () => {
    axios
      .get("https://desa-sembung-be.vercel.app/api/agenda")
      .then((res) => setAgenda(res.data));
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://desa-sembung-be.vercel.app/api/agenda/add", form)
      .then(() => {
        alert("Agenda Berhasil Ditambah!");
        setForm({
          nama_kegiatan: "",
          tanggal: "",
          waktu: "",
          lokasi: "",
          keterangan: "",
        });
        fetchAgenda();
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus agenda ini?")) {
      axios
        .delete(`https://desa-sembung-be.vercel.app/api/agenda/delete/${id}`)
        .then(() => fetchAgenda());
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      {/* Main Content */}
      {/* pt-14 untuk mobile (tinggi topbar Sidebar) + md:ml-64 untuk desktop */}
      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-5 text-gray-800">
            Kelola Agenda Desa
          </h1>

          {/* Form Tambah */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Nama Kegiatan"
              className="border p-2 rounded w-full col-span-1 sm:col-span-2"
              value={form.nama_kegiatan}
              onChange={(e) =>
                setForm({ ...form, nama_kegiatan: e.target.value })
              }
              required
            />
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              required
            />
            <input
              type="time"
              className="border p-2 rounded w-full"
              value={form.waktu}
              onChange={(e) => setForm({ ...form, waktu: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Lokasi"
              className="border p-2 rounded w-full col-span-1 sm:col-span-2"
              value={form.lokasi}
              onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
              required
            />
            <textarea
              placeholder="Keterangan"
              className="border p-2 rounded w-full col-span-1 sm:col-span-2"
              rows={3}
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
            />
            <button className="bg-blue-600 text-white p-2 rounded col-span-1 sm:col-span-2 hover:bg-blue-700 transition font-semibold">
              Simpan Agenda
            </button>
          </form>

          {/* Tabel — sm ke atas */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 font-bold text-gray-700">
                <tr>
                  <th className="p-4 border-b">Kegiatan</th>
                  <th className="p-4 border-b">Tanggal</th>
                  <th className="p-4 border-b">Lokasi</th>
                  <th className="p-4 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {agenda.length > 0 ? (
                  agenda.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-bold text-blue-900">
                        {item.nama_kegiatan}
                      </td>
                      <td className="p-4">
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-gray-600">{item.lokasi}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 font-bold hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-8 text-center text-gray-400 italic"
                    >
                      Belum ada agenda desa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Card list — mobile saja */}
          <div className="sm:hidden flex flex-col gap-3">
            {agenda.length > 0 ? (
              agenda.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1 border border-gray-100"
                >
                  <p className="font-bold text-blue-900 text-sm">
                    {item.nama_kegiatan}
                  </p>
                  <p className="text-xs text-gray-500">
                    📅{" "}
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">📍 {item.lokasi}</p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="mt-2 self-start text-red-600 font-bold text-xs hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 italic text-sm">
                Belum ada agenda desa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaAgenda;
