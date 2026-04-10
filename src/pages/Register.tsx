// Page d'inscription

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap, Mail, Briefcase, User as UserIcon } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

type Role = "student" | "company";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", company_name: "",
    role: "student" as Role,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirige si déjà connecté
  if (user) {
    const dest = user.role === "student" ? "/student" : user.role === "company" ? "/company" : "/admin";
    return <Navigate to={dest} replace />;
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const setRole = (role: Role) => setFormData(prev => ({ ...prev, role }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      toast.success("Inscription réussie ! Veuillez vous connecter.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Inscription échouée");
    }
  };

  return (
    <div className="register-page">

      {/* ── En-tête avec vague ─────────────────────────────── */}
      <div className="register-wave-header">
        <div className="register-wave-logo"><GraduationCap size={32} /></div>
        <div className="register-wave-title">StageConnect</div>
        <div className="register-wave-subtitle">Connectons les talents d'aujourd'hui</div>
      </div>

      {/* ── Formulaire ─────────────────────────────────────── */}
      <div className="register-card">
        <h2 className="register-card-title">Inscription</h2>
        <p className="register-card-subtitle">Créez votre compte StageConnect</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <div className="input-with-icon">
              <UserIcon className="input-icon" size={16} />
              <input type="text" required className="form-input-icon"
                value={formData.name} onChange={set("name")} placeholder="Jean Dupont" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Adresse email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={16} />
              <input type="email" required className="form-input-icon"
                value={formData.email} onChange={set("email")} placeholder="jean.dupont@exemple.com" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input type="password" required className="form-input-icon"
              style={{ paddingLeft: "1rem" }}
              value={formData.password} onChange={set("password")} placeholder="••••••••" />
          </div>

          {/* Champ affiché uniquement pour les entreprises */}
          {formData.role === "company" && (
            <div className="form-group">
              <label className="form-label">Nom de l'entreprise</label>
              <div className="input-with-icon">
                <Briefcase className="input-icon" size={16} />
                <input type="text" required className="form-input-icon"
                  value={formData.company_name} onChange={set("company_name")} placeholder="Ma Société" />
              </div>
            </div>
          )}

          {/* ── Sélecteur de rôle ─────────────────────────── */}
          <div>
            <span className="role-selector-label">Je suis un(e)</span>
            <div className="role-selector">
              <button type="button"
                className={`role-card${formData.role === "student" ? " selected" : ""}`}
                onClick={() => setRole("student")}
              >
                <GraduationCap size={28} /> Étudiant
              </button>
              <button type="button"
                className={`role-card${formData.role === "company" ? " selected" : ""}`}
                onClick={() => setRole("company")}
              >
                <Briefcase size={28} /> Entreprise
              </button>
            </div>
          </div>

          <button type="submit" className="btn-register">Créer un compte</button>
        </form>

        <p className="register-footer-text">
          Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>

      <p className="register-page-footer">© 2026 StageConnect. Tous droits réservés.</p>
    </div>
  );
};

export default Register;
