import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      alert("Username/Email/NIK dan Password wajib diisi!");
      return;
    }

    try {
      const response = await axios.post(
        "https://desa-sembung-be.vercel.app/api/auth/login",
        {
          identifier: identifier,
          password: password,
        },
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Login Berhasil! Selamat datang, ${user.nama_lengkap || "User"}`);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/warga/dashboard");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response?.data?.message || "Terjadi kesalahan sistem");
      } else {
        alert("Gagal terhubung ke server. Pastikan backend nyala!");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center fixed inset-0">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">
            Desa Sembung
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Sistem Pelayanan Surat Digital
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* INPUT IDENTIFIER */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Username / Email / NIK
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
              placeholder="newaditya6@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          {/* INPUT PASSWORD */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all pr-12"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-end mt-3">
              <Link
                to="/lupa-password"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Lupa Password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 uppercase tracking-wide"
            >
              MASUK
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Buat Akun Warga
            </Link>
          </p>

          {/* TOMBOL KEMBALI KE BERANDA (Minimalis & Cantik) */}
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

export default Login;
