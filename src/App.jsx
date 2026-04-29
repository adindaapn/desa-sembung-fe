import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DataPenduduk from "./pages/admin/DataPenduduk";
import KelolaAgenda from "./pages/admin/KelolaAgenda";
import KelolaBerita from "./pages/admin/KelolaBerita";
import KelolaStatistik from "./pages/admin/KelolaStatistik";
import RiwayatSurat from "./pages/admin/RiwayatSurat";
import VerifikasiSurat from "./pages/admin/VerifikasiSurat";
import DetailBerita from "./pages/DetailBerita";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import LupaPassword from "./pages/LupaPassword";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AjukanSurat from "./pages/user/AjukanSurat";
import DashboardWarga from "./pages/user/DashboardWarga";

// 1. PASTIKAN SUDAH IMPORT HALAMAN DETAIL
import DetailPengajuan from "./pages/DetailPengajuan";

function App() {
  return (
    <Router>
      <Routes>
        {/* HALAMAN PUBLIK (UTAMA) */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTHENTICATION */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lupa-password" element={<LupaPassword />} />

        {/* RUTE WARGA */}
        <Route path="/warga/dashboard" element={<DashboardWarga />} />
        <Route path="/warga/ajukan" element={<AjukanSurat />} />
        <Route path="/berita/:id" element={<DetailBerita />} />

        {/* 2. TAMBAHKAN RUTE DETAIL DI SINI (KOREKSI UTAMA) */}
        <Route path="/surat/detail/:id" element={<DetailPengajuan />} />
        <Route path="/admin/surat/detail/:id" element={<DetailPengajuan />} />

        {/* RUTE ADMIN */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/verifikasi" element={<VerifikasiSurat />} />
        <Route path="/admin/riwayat" element={<RiwayatSurat />} />
        <Route path="/admin/agenda" element={<KelolaAgenda />} />
        <Route path="/admin/berita" element={<KelolaBerita />} />
        <Route path="/admin/statistik" element={<KelolaStatistik />} />
        <Route path="/admin/penduduk" element={<DataPenduduk />} />

        {/* TAMBAHAN SAFETY */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
