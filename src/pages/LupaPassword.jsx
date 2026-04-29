import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LupaPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Minta OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    otp: "",
    newPassword: "",
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://desa-sembung-be-production.up.railway.app/api/auth/send-otp",
        {
          identifier: formData.identifier,
        },
      );
      alert("Kode OTP telah dikirim ke nomor WhatsApp Anda.");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://desa-sembung-be-production.up.railway.app/api/auth/reset-password-otp",
        formData,
      );
      alert("Password berhasil diubah! Silakan login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mereset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-2">
          Reset Password
        </h2>
        <p className="text-gray-400 text-xs text-center mb-8">
          Sistem Pelayanan Surat Digital Desa Sembung
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Username / Email / NIK
              </label>
              <input
                type="text"
                required
                className="w-full bg-blue-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.identifier}
                onChange={(e) =>
                  setFormData({ ...formData, identifier: e.target.value })
                }
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              {loading ? "Mengirim..." : "Kirim Kode OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">
                MASUKKAN 6 DIGIT OTP
              </label>
              <input
                type="text"
                maxLength="6"
                required
                className="w-full bg-blue-50 border-0 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">
                PASSWORD BARU
              </label>
              <input
                type="password"
                required
                className="w-full bg-blue-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
            >
              {loading ? "Memproses..." : "Ganti Password"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-gray-400 font-medium"
            >
              Kirim ulang kode OTP
            </button>
          </form>
        )}
        <div className="mt-8 text-center">
          <Link to="/login" className="text-xs font-bold text-blue-600">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;
