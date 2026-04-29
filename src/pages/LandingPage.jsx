import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Import aset gambar
import fotoKantorDesa from "../assets/kantor-desa.jpeg"; // Import foto Kantor Desa baru
import logoLamongan from "../assets/logo-lamongan.png";

const LandingPage = () => {
  const [berita, setBerita] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [statistik, setStatistik] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    axios
      .get("https://desa-sembung-be.vercel.app/api/berita")
      .then((res) => setBerita(res.data))
      .catch((err) => console.log("Gagal memuat berita:", err));

    axios
      .get("https://desa-sembung-be.vercel.app/api/agenda")
      .then((res) => setAgenda(res.data))
      .catch((err) => console.log("Gagal memuat agenda:", err));

    axios
      .get("https://desa-sembung-be.vercel.app/api/statistik")
      .then((res) => setStatistik(res.data))
      .catch((err) => console.log("Gagal memuat statistik:", err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* 1. NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo & Nama Desa */}
          <div className="flex items-center gap-3">
            <img
              src={logoLamongan}
              alt="Logo Lamongan"
              className="w-10 h-10 object-contain"
            />
            <div className="font-bold text-xl text-blue-600 uppercase tracking-wider">
              Desa Sembung
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <a href="#profil" className="hover:text-blue-600 transition">
              Profil
            </a>
            <a href="#berita" className="hover:text-blue-600 transition">
              Berita
            </a>
            <a href="#agenda" className="hover:text-blue-600 transition">
              Agenda
            </a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Login Layanan
            </Link>
          </div>

          {/* Hamburger Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
            <a
              href="#profil"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Profil
            </a>
            <a
              href="#berita"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Berita
            </a>
            <a
              href="#agenda"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Agenda
            </a>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md text-center"
            >
              Login Layanan
            </Link>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION - GANTI LATAR BELAKANG JADI FOTO */}
      <header
        className="relative bg-gray-800 py-24 md:py-32 text-center text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fotoKantorDesa})` }} // Menggunakan foto Kantor Desa sebagai BG
      >
        {/* Overlay gelap agar teks terbaca jelas */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Selamat Datang di Desa Sembung
          </h1>
          <p className="mt-4 text-base md:text-lg opacity-90 max-w-2xl mx-auto font-light leading-relaxed">
            Informasi Terkini, Transparansi Dana Desa, dan Pelayanan Publik
            Digital Terpadu.
          </p>
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <a
              href="#berita"
              className="bg-white text-blue-700 px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Jelajahi Berita
            </a>
            <Link
              to="/register"
              className="bg-blue-600/80 text-white border border-white/30 px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition duration-300"
            >
              Buat Akun Warga
            </Link>
          </div>
        </div>
      </header>

      {/* 3. STATISTIK DESA */}
      <section className="max-w-6xl mx-auto -mt-10 md:-mt-14 relative z-20 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {statistik.length > 0
            ? statistik.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white p-5 md:p-7 rounded-2xl shadow-2xl text-center border border-gray-100 transform hover:-translate-y-1.5 transition duration-300"
                >
                  <div className="text-2xl md:text-3xl font-black text-blue-600">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase mt-1.5 tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))
            : [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-xl animate-pulse h-20 md:h-24"
                ></div>
              ))}
        </div>
      </section>

      {/* 4. VISI & MISI */}
      <section
        id="profil"
        className="max-w-4xl mx-auto py-16 md:py-28 px-6 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-7 md:mb-10 text-gray-900">
          Visi & Misi Desa
        </h2>
        <div className="bg-blue-50 p-8 md:p-12 rounded-3xl border border-blue-100 italic text-lg md:text-2xl text-blue-950 leading-relaxed shadow-inner font-medium">
          "Mewujudkan Desa Sembung yang Mandiri, Sejahtera, dan Berbasis
          Teknologi Melalui Pelayanan Publik yang Prima."
        </div>
      </section>

      {/* 5. DAFTAR BERITA */}
      <section
        id="berita"
        className="max-w-6xl mx-auto py-10 md:py-16 px-4 md:px-6"
      >
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Kabar Desa Sembung
          </h2>
          <p className="text-gray-500 mt-2.5 text-sm md:text-base max-w-xl">
            Update kegiatan dan informasi penting dari perangkat desa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {berita.length > 0 ? (
            berita.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`https://desa-sembung-be.vercel.app/uploads/berita/${item.gambar}`}
                    className="h-52 md:h-60 w-full object-cover group-hover:scale-105 transition duration-500"
                    alt={item.judul}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/400x200")
                    }
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg z-10">
                    {item.kategori}
                  </div>
                </div>
                <div className="p-6 md:p-7 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold leading-snug group-hover:text-blue-600 transition h-14 md:h-16 line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 text-sm mt-4 md:mt-5 line-clamp-3 leading-relaxed flex-1">
                    {item.isi}
                  </p>
                  <div className="mt-6 md:mt-8 pt-6 md:pt-7 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400">
                      {new Date(item.tgl_posting).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      to={`/berita/${item.id}`}
                      className="text-blue-600 text-sm font-bold flex items-center gap-1.5 hover:gap-3 transition-all duration-300"
                    >
                      Baca Selengkapnya <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 py-24 text-center text-gray-400 italic bg-gray-100 rounded-2xl">
              Belum ada berita yang diposting.
            </div>
          )}
        </div>
      </section>

      {/* 6. AGENDA DESA */}
      <section
        id="agenda"
        className="bg-white py-20 md:py-28 px-4 md:px-6 border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-14 border-l-4 border-blue-600 pl-5 text-gray-900">
            Agenda Desa Mendatang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {agenda.length > 0 ? (
              agenda.map((item) => (
                <div
                  key={item.id}
                  className="flex bg-blue-50/50 p-5 md:p-7 rounded-2xl border border-blue-100 hover:shadow-lg hover:bg-blue-50 transition duration-300 items-center"
                >
                  <div className="text-center pr-5 md:pr-7 border-r-2 border-blue-200 min-w-[65px]">
                    <div className="text-blue-700 font-black text-3xl md:text-4xl">
                      {new Date(item.tanggal).getDate()}
                    </div>
                    <div className="text-[11px] font-bold uppercase text-gray-600 tracking-wider mt-1">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        month: "short",
                      })}
                    </div>
                  </div>
                  <div className="pl-5 md:pl-7 min-w-0">
                    <h4 className="font-bold text-base md:text-lg text-gray-800 truncate leading-tight">
                      {item.nama_kegiatan}
                    </h4>
                    <div className="text-sm text-gray-600 mt-2 flex items-center gap-2 truncate">
                      📍 <span>{item.lokasi}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      ⏰ <span>{item.waktu.slice(0, 5)} WIB</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center text-gray-400 italic py-12 bg-gray-50 rounded-2xl">
                Belum ada agenda terdekat.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-gray-950 text-white pt-20 md:pt-28 pb-12 border-t-4 border-blue-600">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="text-left">
            <div className="font-black text-2xl tracking-tighter mb-5 md:mb-7 flex items-center gap-3">
              <img
                src={logoLamongan}
                alt="Logo"
                className="w-9 h-9 object-contain filter brightness-0 invert"
              />
              DESA SEMBUNG
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Website resmi Pemerintah Desa Sembung. Hadir untuk memberikan
              pelayanan informasi dan administrasi yang lebih cepat, transparan,
              dan akuntabel kepada seluruh warga.
            </p>
          </div>
          <div className="text-left">
            <h4 className="font-bold text-lg mb-5 md:mb-7 text-gray-100">
              Kontak Kami
            </h4>
            <ul className="text-gray-400 text-sm space-y-3.5 md:space-y-4">
              <li className="flex gap-3 items-start">
                <span>📍</span>{" "}
                <span>
                  Jl. Raya Sembung No. 01, Kec. Sukorame, Kab. Lamongan, Jawa
                  Timur
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <span>📧</span> <span>info@desasembung.id</span>
              </li>
              <li className="flex gap-3 items-center">
                <span>📞</span> <span>(0322) 123456</span>
              </li>
              <li className="flex gap-3 items-center">
                <span>🕒</span> <span>Senin - Jumat: 08.00 - 15.00</span>
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h4 className="font-bold text-lg mb-5 md:mb-7 text-gray-100">
              Lokasi Kantor Desa
            </h4>
            <div className="rounded-xl overflow-hidden h-56 md:h-64 bg-gray-800 border-2 border-gray-700 shadow-2xl">
              <iframe
                title="Lokasi Balai Desa Sembung"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.824242424242!2d112.1234567!3d-7.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77f00000000000%3A0x0000000000000000!2sBalai%20Desa%20Sembung!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid" // Gunakan URL embed maps asli
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            {/* Memperbaiki perataan teks alamat menjadi rata kiri */}
            <p className="mt-4 text-[11px] text-gray-500 italic text-left leading-relaxed">
              Sembung, Kec. Sukorame, Kabupaten Lamongan, Jawa Timur 62276
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-16 md:mt-24 pt-9 border-t border-white/5 text-center text-gray-600 text-[10px] font-medium tracking-widest uppercase">
          © 2026 Pemerintah Desa Sembung. All Rights Reserved. Lamongan, Jawa
          Timur.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
