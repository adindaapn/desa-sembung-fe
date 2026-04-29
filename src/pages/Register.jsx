import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // State form lengkap (Sesuai Backend)
  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    username: "",
    email: "",
    no_hp: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (
      !formData.nik ||
      !formData.nama_lengkap ||
      !formData.username ||
      !formData.password
    ) {
      alert("Data wajib (NIK, Nama, Username, Password) harus diisi!");
      return;
    }

    try {
      await axios.post(
        "https://desa-sembung-be.vercel.app/api/auth/register",
        formData,
      );
      alert(
        "Pendaftaran Berhasil! Silakan Login dengan Username/Email baru Anda.",
      );
      navigate("/login"); // Pindah ke halaman login
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Gagal mendaftar. Cek koneksi server.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center fixed inset-0 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full my-8 overflow-y-auto max-h-[90vh] border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">
            Daftar Akun Baru
          </h1>
          <p className="text-gray-400 text-sm mt-1 uppercase font-bold tracking-widest">
            Desa Sembung
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* NIK */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm ml-1">
              NIK (Sesuai KTP)
            </label>
            <input
              name="nik"
              type="text"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all text-sm"
              placeholder="16 digit nomor induk kependudukan"
              required
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm ml-1">
              Nama Lengkap
            </label>
            <input
              name="nama_lengkap"
              type="text"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all text-sm"
              placeholder="Nama lengkap sesuai KTP"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm ml-1">
              Username (Untuk Login)
            </label>
            <input
              name="username"
              type="text"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all text-sm"
              placeholder="Contoh: budisembung123"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm ml-1">
              Email (Opsional)
            </label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all text-sm"
              placeholder="email@contoh.com"
            />
          </div>

          {/* No HP */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm ml-1">
              No. HP (WhatsApp)
            </label>
            <input
              name="no_hp"
              type="text"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all text-sm"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm ml-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 uppercase tracking-wide"
            >
              DAFTAR SEKARANG
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Login disini
            </Link>
          </p>

          {/* TOMBOL KEMBALI KE BERANDA */}
          <div className="pt-4 border-t border-gray-50">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors font-medium text-xs uppercase tracking-widest"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
