// Barre de navigation principale

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, LayoutDashboard, LogOut, Plus, ChevronDown, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CreateOfferModal from "./CreateOfferModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [entreprisesDropdownOpen, setEntreprisesDropdownOpen] = useState(false);
  const [modalOpen,    setModalOpen]    = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const entreprisesRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (entreprisesRef.current && !entreprisesRef.current.contains(e.target as Node)) {
        setEntreprisesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    // Event custom pour ouvrir le modal depuis le Footer
    const openModalListener = () => setModalOpen(true);
    window.addEventListener('openOfferModal', openModalListener);

    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener('openOfferModal', openModalListener);
    };
  }, []);

  // Chemin du tableau de bord selon le rôle
  const dashboardPath =
    user?.role === "student" ? "/student" :
    user?.role === "company" ? "/company" :
    user?.role === "admin"   ? "/admin"   : "/";

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const linkClass = (path: string) => isActive(path) ? "nav-link-active" : "nav-link";

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo"><GraduationCap size={20} /></div>
          <span className="navbar-brand-name">StageConnect</span>
        </Link>

        <div className="navbar-links">
          <Link to="/"       className={linkClass("/")}>Accueil</Link>
          <Link to="/offers" className={linkClass("/offers")}>Offres</Link>

          {user?.role === "student" && (
            <Link to="/mes-candidatures" className={linkClass("/mes-candidatures")}>
              Mes Candidatures
            </Link>
          )}

          {user && (user.role === "company" || user.role === "admin") && (
            <Link to="/candidatures-recues" className={linkClass("/candidatures-recues")}>
              Candidatures reçues
            </Link>
          )}

          {/* ── Dropdown Entreprises ── */}
          <div 
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setEntreprisesDropdownOpen(true)}
            onMouseLeave={() => setEntreprisesDropdownOpen(false)}
          >
            <div
              className={location.pathname.startsWith("/companies") ? "nav-link-active" : "nav-link"}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%' }}
            >
              Entreprises
            </div>

            {entreprisesDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: '15px', zIndex: 1000 }}>
                <div style={{
                  background: '#fff', borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid var(--gray-100)',
                  minWidth: '220px', padding: '8px', animation: 'dropIn 0.15s ease',
                }}>
                  <Link 
                    to="/companies" 
                    onClick={() => setEntreprisesDropdownOpen(false)}
                    style={{
                      display: 'block', padding: '10px 14px', color: 'var(--gray-700)',
                      textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, borderRadius: '8px',
                      transition: 'background 0.2s'
                    }} 
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} 
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Liste des entreprises
                  </Link>
                  
                  {(user?.role === "company" || user?.role === "admin") && (
                    <button
                      onClick={() => {
                        setEntreprisesDropdownOpen(false);
                        setModalOpen(true);
                      }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'var(--indigo-50)', color: 'var(--indigo-600)',
                        border: 'none', borderRadius: '8px',
                        padding: '10px 14px', fontSize: '0.9rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'background 0.2s',
                        marginTop: '4px'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--indigo-600)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--indigo-50)'; e.currentTarget.style.color = 'var(--indigo-600)'; }}
                    >
                      <Plus size={16} /> Ajouter une offre
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <>
              {/* ── Badge entreprise cliquable ── */}
              {user.role === "company" && (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: dropdownOpen ? 'var(--indigo-100)' : 'var(--indigo-50)',
                      color: 'var(--indigo-600)',
                      border: '1.5px solid var(--indigo-100)',
                      borderRadius: '20px', padding: '4px 14px',
                      fontSize: '0.8125rem', fontWeight: 700,
                      whiteSpace: 'nowrap', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    🏢 {user.company_name || user.name}
                    <ChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.2s',
                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>

                  {/* ── Dropdown menu ── */}
                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                      background: '#fff', borderRadius: '14px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                      border: '1px solid var(--gray-100)',
                      minWidth: '220px', zIndex: 500,
                      overflow: 'hidden',
                      animation: 'dropIn 0.15s ease',
                    }}>
                      <style>{`
                        @keyframes dropIn {
                          from { opacity: 0; transform: translateY(-6px); }
                          to   { opacity: 1; transform: translateY(0); }
                        }
                      `}</style>

                      {/* Info entreprise */}
                      <div style={{
                        padding: '14px 18px 10px',
                        borderBottom: '1px solid var(--gray-100)',
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Connecté en tant qu'entreprise
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--gray-900)', marginTop: '2px' }}>
                          {user.company_name || user.name}
                        </div>
                      </div>

                      {/* Bouton Ajouter une offre */}
                      <div style={{ padding: '10px 10px' }}>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setModalOpen(true);
                          }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                            background: 'var(--indigo-600)', color: '#fff',
                            border: 'none', borderRadius: '10px',
                            padding: '11px 16px', fontSize: '0.9rem', fontWeight: 700,
                            cursor: 'pointer', transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--indigo-700)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'var(--indigo-600)')}
                        >
                          <Plus size={16} /> Ajouter une offre
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Link
                to={dashboardPath}
                className={`${linkClass(dashboardPath)} nav-link-icon`}
              >
                <LayoutDashboard size={16} />
                Tableau de bord
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="nav-link-danger"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login"    className={linkClass("/login")}>Connexion</Link>
              <Link to="/register" className="btn btn-primary">S'inscrire</Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── Modal création d'offre ── */}
      <CreateOfferModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
