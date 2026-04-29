import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const Profile = () => {
  const userLocal = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    username: "",
    email: "",
    no_hp: "",
    password: "",
    foto: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://desa-sembung-be-production.up.railway.app/api/auth/profile/${userLocal.id}`,
        );
        if (res.data) {
          setFormData({ ...res.data, password: "" });
        }
      } catch (err) {
        console.error("Gagal ambil profil dari server:", err);
        setFormData({ ...userLocal, password: "" });
      }
    };

    if (userLocal?.id) {
      fetchProfile();
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    if (!formData.nama_lengkap || !formData.email || !formData.no_hp) {
      alert("Nama lengkap, email, dan nomor HP wajib diisi!");
      return;
    }
    if (!window.confirm("Simpan perubahan profil Anda?")) return;

    const data = new FormData();
    data.append("nama_lengkap", formData.nama_lengkap.trim());
    data.append("username", formData.username.trim());
    data.append("email", formData.email.trim());
    data.append("no_hp", formData.no_hp.trim());
    if (formData.password && formData.password.trim() !== "") {
      data.append("password", formData.password.trim());
    }
    if (selectedFile) {
      data.append("foto", selectedFile);
    }

    try {
      const res = await axios.put(
        `https://desa-sembung-be-production.up.railway.app/api/auth/profile/${userLocal.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      alert("Sukses! Profil Anda telah diperbarui.");
      setIsEditing(false);

      const updatedUser = {
        ...userLocal,
        nama_lengkap: formData.nama_lengkap,
        username: formData.username,
        email: formData.email,
        no_hp: formData.no_hp,
        foto: res.data.foto || formData.foto,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal memperbarui profil.",
      );
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar role={userLocal?.role} />

      <div className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase mt-6">
            Panel — Desa Sembung
          </p>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Profil Saya
          </h1>
        </div>

        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
              <img
                src={
                  preview ||
                  (formData.foto
                    ? `https://desa-sembung-be-production.up.railway.app/uploads/profile/${formData.foto}`
                    : "https://via.placeholder.com/150")
                }
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
              {isEditing && (
                <label className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer text-white shadow-md hover:bg-blue-700 transition flex items-center justify-center border-2 border-white">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <span className="text-xs">📷</span>
                </label>
              )}
            </div>
            <p className="mt-3 text-xs md:text-sm text-gray-500 font-medium">
              {isEditing
                ? "Klik ikon kamera untuk ganti foto"
                : "Foto Profil Pengguna"}
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 md:space-y-5">
            {/* NIK */}
            <div>
              <label className="block text-gray-600 font-bold mb-1 text-xs uppercase tracking-wide">
                NIK (Nomor Induk Kependudukan)
              </label>
              <input
                type="text"
                value={formData.nik || ""}
                disabled
                className="w-full border p-3 rounded-xl bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed text-sm"
              />
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-sm">
                Nama Lengkap
              </label>
              <input
                name="nama_lengkap"
                type="text"
                value={formData.nama_lengkap}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border p-3 rounded-xl transition-all text-sm ${
                  !isEditing
                    ? "bg-gray-50 text-gray-400"
                    : "bg-white border-blue-400 ring-2 ring-blue-100"
                }`}
              />
            </div>

            {/* Username & No HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-sm">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full border p-3 rounded-xl text-sm ${
                    !isEditing
                      ? "bg-gray-50 text-gray-400"
                      : "bg-white border-blue-400"
                  }`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-sm">
                  No. HP (WhatsApp)
                </label>
                <input
                  name="no_hp"
                  type="text"
                  value={formData.no_hp || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  placeholder="Contoh: 081234567890"
                  className={`w-full border p-3 rounded-xl text-sm ${
                    !isEditing
                      ? "bg-gray-50 text-gray-400"
                      : "bg-white border-blue-400"
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-bold mb-1 text-sm">
                Alamat Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                disabled={!isEditing}
                required
                placeholder="Contoh: email@domain.com"
                className={`w-full border p-3 rounded-xl text-sm ${
                  !isEditing
                    ? "bg-gray-50 text-gray-400"
                    : "bg-white border-blue-400"
                }`}
              />
            </div>

            {/* Ganti Password */}
            {isEditing && (
              <div className="bg-blue-50 p-4 md:p-5 rounded-xl border border-blue-200">
                <label className="block text-blue-800 font-bold mb-1 text-sm">
                  Ganti Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengganti"
                  onChange={handleChange}
                  className="w-full border border-blue-300 p-3 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex gap-3 md:gap-4 pt-5 border-t mt-4 md:mt-6">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-colors text-sm md:text-base"
                >
                  Edit Profil
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md text-sm md:text-base"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPreview(null);
                      setSelectedFile(null);
                      window.location.reload();
                    }}
                    className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 shadow-sm text-sm md:text-base"
                  >
                    Batal
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
