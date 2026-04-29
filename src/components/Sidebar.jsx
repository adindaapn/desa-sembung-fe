import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Pastikan path impor logo sudah benar sesuai folder assets Anda
import logoLamongan from "../assets/logo-lamongan.png";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    const yakin = window.confirm("Apakah Anda yakin ingin keluar?");
    if (yakin) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  const menuItemClass = (path) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive(path)
        ? "bg-white text-blue-800 shadow-sm"
        : "text-blue-100 hover:bg-blue-700/60 hover:text-white"
    }`;

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div
      className="w-64 min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #1a3a8f 0%, #1e40af 100%)",
      }}
    >
      {/* LOGO SECTION */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-1">
          <img
            src={logoLamongan}
            alt="Logo Lamongan"
            className="w-10 h-10 object-contain filter drop-shadow-md"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
              Desa Sembung
            </h1>
            <p className="text-[10px] text-blue-300 font-medium tracking-wider uppercase">
              {role === "admin" ? "Panel Admin" : "Panel Warga"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-blue-600/50 mb-6" />

      <nav className="flex-1 px-3 flex flex-col gap-1">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest px-4 mb-2">
          Menu Utama
        </p>

        {role === "admin" ? (
          <>
            <Link
              to="/admin/dashboard"
              onClick={handleMenuClick}
              className={menuItemClass("/admin/dashboard")}
            >
              <span className="text-base">🏠</span>
              <span>Dashboard</span>
              {isActive("/admin/dashboard") && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </Link>
            <Link
              to="/admin/verifikasi"
              onClick={handleMenuClick}
              className={menuItemClass("/admin/verifikasi")}
            >
              <span className="text-base">✉️</span>
              <span>Verifikasi Surat</span>
            </Link>
            <Link
              to="/admin/riwayat"
              onClick={handleMenuClick}
              className={menuItemClass("/admin/riwayat")}
            >
              <span className="text-base">📋</span>
              <span>Riwayat Surat</span>
            </Link>
            {/* MENU BARU: DATA PENDUDUK */}
            <Link
              to="/admin/penduduk"
              onClick={handleMenuClick}
              className={menuItemClass("/admin/penduduk")}
            >
              <span className="text-base">👥</span>
              <span>Data Penduduk</span>
              {isActive("/admin/penduduk") && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </Link>
            <Link
              to="/admin/agenda"
              onClick={handleMenuClick}
              className={menuItemClass("/admin/agenda")}
            >
              <span className="text-base">📅</span>
              <span>Kelola Agenda</span>
            </Link>
            <Link
              to="/admin/berita"
              onClick={handleMenuClick}
              className={menuItemClass("/admin/berita")}
            >
              <span className="text-base">📰</span>
              <span>Kelola Berita</span>
            </Link>
            <Link
              to="/admin/statistik"
              onClick={handleMenuClick}
              className={menuItemClass("/admin/statistik")}
            >
              <span className="text-base">📊</span>
              <span>Kelola Statistik</span>
            </Link>
            <Link
              to="/profile"
              onClick={handleMenuClick}
              className={menuItemClass("/profile")}
            >
              <span className="text-base">⚙️</span>
              <span>Kelola Akun</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/warga/dashboard"
              onClick={handleMenuClick}
              className={menuItemClass("/warga/dashboard")}
            >
              <span className="text-base">🏠</span>
              <span>Dashboard</span>
              {isActive("/warga/dashboard") && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </Link>
            <Link
              to="/warga/ajukan"
              onClick={handleMenuClick}
              className={menuItemClass("/warga/ajukan")}
            >
              <span className="text-base">✉️</span>
              <span>Ajukan Surat</span>
            </Link>
            <Link
              to="/profile"
              onClick={handleMenuClick}
              className={menuItemClass("/profile")}
            >
              <span className="text-base">⚙️</span>
              <span>Kelola Akun</span>
            </Link>
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-blue-600/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white text-sm font-semibold transition-all duration-150"
        >
          <span className="text-base">🚪</span>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ background: "#1a3a8f" }}
      >
        <div className="flex items-center gap-2">
          <img
            src={logoLamongan}
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-bold text-sm">Desa Sembung</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
          ></span>
        </button>
      </div>

      {/* Mobile Overlay & Drawer */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`md:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full z-40 shadow-xl">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
