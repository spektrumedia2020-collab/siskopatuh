import { ErrorBoundary } from "./ErrorBoundary";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { PublicLanding } from "./pages/PublicLanding";
import { Login } from "./pages/Login";
import { CekPorsi } from "./pages/CekPorsi";
import { Direktori } from "./pages/Direktori";
import { Panduan } from "./pages/Panduan";
import { JemaahDashboard } from "./pages/jemaah/Dashboard";
import { PenyelenggaraDashboard } from "./pages/penyelenggara/Dashboard";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { HeroSettings } from "./pages/admin/HeroSettings";
import { TwinCardSettings } from "./pages/admin/TwinCardSettings";
import { DesainPortal } from "./pages/admin/DesainPortal";
import { ManajemenAdmin } from "./pages/admin/ManajemenAdmin";
import { ManajemenPanduan } from "./pages/admin/ManajemenPanduan";

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary><Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<PublicLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cek-porsi" element={<CekPorsi />} />
            <Route path="/direktori" element={<Direktori />} />
            <Route path="/panduan" element={<Panduan />} />
          </Route>

          {/* Jemaah Routes */}
          <Route path="/jemaah" element={<DashboardLayout role="jemaah" />}>
            <Route index element={<JemaahDashboard />} />
            <Route path="keuangan" element={<JemaahDashboard />} />
            <Route path="dokumen" element={<JemaahDashboard />} />
            <Route path="timeline" element={<JemaahDashboard />} />
            <Route path="aduan" element={<JemaahDashboard />} />
            <Route path="profil" element={<JemaahDashboard />} />
          </Route>

          {/* Penyelenggara Routes */}
          <Route path="/penyelenggara" element={<DashboardLayout role="penyelenggara" />}>
            <Route index element={<PenyelenggaraDashboard />} />
            <Route path="paket" element={<PenyelenggaraDashboard />} />
            <Route path="escrow" element={<PenyelenggaraDashboard />} />
            <Route path="manifes" element={<PenyelenggaraDashboard />} />
            <Route path="operasional" element={<PenyelenggaraDashboard />} />
            <Route path="konsorsium" element={<PenyelenggaraDashboard />} />
            <Route path="api" element={<PenyelenggaraDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="kuota" element={<AdminDashboard />} />
            <Route path="kepatuhan" element={<AdminDashboard />} />
            <Route path="ews" element={<AdminDashboard />} />
            <Route path="aduan" element={<AdminDashboard />} />
            <Route path="registrasi" element={<AdminDashboard />} />
            <Route path="operasional" element={<AdminDashboard />} />
            <Route path="scanner" element={<AdminDashboard />} />
            <Route path="ledger" element={<AdminDashboard />} />
            <Route path="integrasi" element={<AdminDashboard />} />
            <Route path="desain" element={<DesainPortal />} />
            <Route path="manajemen-admin" element={<ManajemenAdmin />} />
            <Route path="panduan" element={<ManajemenPanduan />} />
          </Route>
          <Route path="*" element={<div className="p-10 text-white">404 - Halaman Tidak Ditemukan (atau URL salah)</div>} />
        </Routes>
      </Router></ErrorBoundary>
    </ThemeProvider>
  );
}
