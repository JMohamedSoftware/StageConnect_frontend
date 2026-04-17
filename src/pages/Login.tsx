// Page de connexion

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Briefcase, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

// Retourne le chemin du tableau de bord selon le rôle
const getDashboardPath = (role: string) =>
  role === "student" ? "/student" :
    role === "company" ? "/company" : "/admin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirige si déjà connecté
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      toast.success("Bienvenue !");
      navigate(getDashboardPath(res.data.user.role));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Connexion échouée");
    }
  };

  return (
    <div className="login-page">
      <button 
        onClick={() => navigate(-1)} 
        style={{ position: 'absolute', top: '24px', left: '24px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', color: 'var(--gray-600)' }}
      >
        <ArrowLeft size={20} />
      </button>
      <div className="login-card">
        <div className="login-card-bar" />
        <div className="login-card-body">

          <div className="login-logo-wrap">
            <div className="login-logo"><Briefcase size={28} /></div>
          </div>
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">Connectez-vous à votre espace</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Adresse e-mail</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={16} />
                <input
                  type="email" required
                  className="form-input-icon"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="etudiant@ecole.fr"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <div className="form-label-row">
                <label className="form-label" style={{ marginBottom: 0 }}>Mot de passe</label>
                <span className="forgot-link">Mot de passe oublié ?</span>
              </div>
              <div className="input-with-icon">
                <input
                  type="password" required
                  className="form-input-icon"
                  style={{ paddingLeft: "1rem" }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn-login">
              Se connecter <ArrowRight size={18} />
            </button>
          </form>

          <p className="login-footer-text">
            Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </div>
      </div>
      <p className="login-page-footer">© 2026 StageConnect. Tous droits réservés.</p>
    </div>
  );
};

export default Login;

