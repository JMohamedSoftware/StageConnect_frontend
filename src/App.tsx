// Point d'entrée principal — uniquement le routing de l'application

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home              from "./pages/Home";
import Login             from "./pages/Login";
import Register          from "./pages/Register";
import Offers            from "./pages/Offers";
import StudentDashboard  from "./pages/StudentDashboard";
import MesCandidatures   from "./pages/MesCandidatures";
import CompanyDashboard  from "./pages/CompanyDashboard";
import AdminDashboard    from "./pages/AdminDashboard";
import LandingPage       from "./pages/LandingPage";
import OfferDetail       from "./pages/OfferDetail";
import ApplyForOffer     from "./pages/ApplyForOffer";
import CandidaturesRecues from "./pages/CandidaturesRecues";

import "./index.css";

// Masque la navbar sur les pages d'authentification
const NavbarWrapper = () => {
  const { pathname } = useLocation();
  const isAuthPage = ["/login", "/register"].includes(pathname);
  return isAuthPage ? null : <Navbar />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavbarWrapper />
        <Routes>
          <Route path="/"        element={<LandingPage />} />
          <Route path="/home"    element={<><Home /><Footer /></>} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/offers"  element={<><Offers /><Footer /></>} />
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/mes-candidatures" element={<ProtectedRoute role="student"><MesCandidatures /></ProtectedRoute>} />
          <Route path="/company" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/admin"   element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/offers/:id" element={<><OfferDetail /><Footer /></>} />
          <Route path="/offers/:id/apply" element={<ProtectedRoute role="student"><ApplyForOffer /></ProtectedRoute>} />
          <Route path="/candidatures-recues" element={<ProtectedRoute role="company"><CandidaturesRecues /></ProtectedRoute>} />
        </Routes>
        <Toaster position="bottom-right" richColors />
      </Router>
    </AuthProvider>
  );
}
