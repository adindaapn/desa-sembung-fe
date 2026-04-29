import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const DetailBerita = () => {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://desa-sembung-be-production.up.railway.app/api/berita/${id}`)
      .then((res) => {
        setBerita(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat berita:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-20">Memuat berita...</div>;
  if (!berita)
    return <div className="text-center py-20">Berita tidak ditemukan.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Navbar Simple */}
      <nav className="bg-white shadow-sm py-4 px-6 mb-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-blue-600 font-bold text-xl">
            DESA SEMBUNG
          </Link>
          <Link to="/" className="text-gray-500 hover:text-blue-600 text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        {/* Gambar Utama */}
        <img
          src={
            berita.gambar?.startsWith("http")
              ? berita.gambar
              : `https://desa-sembung-be-production.up.railway.app/uploads/berita/${berita.gambar}`
          }
          className="w-full h-[400px] object-cover"
          alt={berita.judul}
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/800x400")
          }
        />

        <div className="p-10">
          <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            {berita.kategori}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
            {berita.judul}
          </h1>
          <div className="flex items-center text-gray-400 text-sm mt-6 border-b pb-6">
            <span className="mr-4">👤 Admin Desa</span>
            <span>
              📅{" "}
              {new Date(berita.tgl_posting).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Isi Berita */}
          <div className="mt-8 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {berita.isi}
          </div>
        </div>
      </article>

      {/* Section Komentar (Opsional/Statik) */}
      <div className="max-w-4xl mx-auto mt-10 p-10 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Komentar</h3>
        <p className="text-gray-400 italic">
          Fitur komentar akan segera hadir untuk warga terdaftar.
        </p>
      </div>
    </div>
  );
};

export default DetailBerita;
