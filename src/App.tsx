import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import PlatformActivity from "./pages/Admin/PlatformActivity";
import ManagePatients from "./pages/Admin/ManagePatients";
import ManageDoctors from "./pages/Admin/ManageDoctors";
import CredentialVerification from "./pages/Admin/CredentialVerification";
import Settings from "./pages/Admin/Settings";
import PatientRegister from "./pages/Patient/PatientRegister";
import PatientLogin from "./pages/Patient/PatientLogin";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import BookAppointment from "./pages/Patient/BookAppointment";
import PatientProfile from "./pages/Patient/PatientProfile";
import DoctorRegister from "./pages/Doctor/DoctorRegister";
import DoctorLogin from "./pages/Doctor/DoctorLogin";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Patient Routes */}
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<PlatformActivity />} />
            <Route path="patients" element={<ManagePatients />} />

            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="verify-doctors" element={<CredentialVerification />} />

            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
