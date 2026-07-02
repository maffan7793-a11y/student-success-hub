import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Apply from "./pages/Apply";
import VerifyCertificate from "./pages/VerifyCertificate";

import DashboardLayout from "./pages/student/DashboardLayout";
import Overview from "./pages/student/Overview";
import DigitalId from "./pages/student/DigitalId";
import MyTasks from "./pages/student/MyTasks";
import Certificates from "./pages/student/Certificates";
import Profile from "./pages/student/Profile";
import Support from "./pages/student/Support";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminPayments from "./pages/admin/AdminPayments";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allow={["student"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="digital-id" element={<DigitalId />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allow={["admin", "super_admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
