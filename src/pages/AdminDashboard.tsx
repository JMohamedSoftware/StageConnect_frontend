// Tableau de bord administrateur : stats, graphique, candidatures récentes, gestion utilisateurs

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, Briefcase, FileText, User as UserIcon,
  Bell, Settings, Users, CheckCircle, Clock,
  TrendingUp, TrendingDown, Trash2,
} from "lucide-react";
import api from "../api";
import type { User, Offer } from "../types";

// ── Constantes ────────────────────────────────────────────────

const SIDEBAR_ITEMS = [
  { id: "dashboard",     icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "offers",        icon: Briefcase,       label: "Offres de stage" },
  { id: "applications",  icon: FileText,        label: "Candidatures"    },
  { id: "profile",       icon: UserIcon,        label: "Profil"          },
  { id: "notifications", icon: Bell,            label: "Notifications"   },
  { id: "settings",      icon: Settings,        label: "Paramètres"      },
];

// Pas de données de démo ici, on utilisera les données réelles

// Jours de la semaine pour l'axe X du graphique
const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Badge CSS selon le rôle
const roleClass = (role: string) =>
  role === "admin"   ? "badge-role badge-role-admin"   :
  role === "company" ? "badge-role badge-role-company" :
  "badge-role badge-role-student";

// Couleur du point de statut
const statusDotColor = (status: string) =>
  status === "accepted" ? "green" : status === "pending" ? "orange" : "red";

const statusDotIcon = (status: string) =>
  status === "accepted" ? "✓" : status === "pending" ? "○" : "✕";

// ── Composants internes ───────────────────────────────────────

// Graphique d'activité SVG
const ActivityChart = () => (
  <div className="chart-card">
    <div className="chart-card-header">
      <span className="chart-card-title">Activité de la semaine</span>
      <select className="chart-period-select"><option>Cette semaine</option></select>
    </div>
    <div className="chart-container">
      <svg className="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.5"  />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.4"  />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Lignes horizontales de grille */}
        {[0, 50, 100, 150, 200].map(y => (
          <line key={y} x1="0" y1={y} x2="700" y2={y}
            stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        {/* Courbe violette (offres) */}
        <path d="M0,160 C80,120 140,100 200,110 C260,120 300,60 360,40 C420,20 480,80 560,100 C620,115 680,140 700,145 L700,200 L0,200 Z"
          fill="url(#grad1)" />
        <path d="M0,160 C80,120 140,100 200,110 C260,120 300,60 360,40 C420,20 480,80 560,100 C620,115 680,140 700,145"
          fill="none" stroke="#a855f7" strokeWidth="2.5" />
        {/* Courbe bleue (candidatures) */}
        <path d="M0,190 C80,185 140,175 200,170 C260,165 320,150 380,155 C440,160 500,158 560,165 C620,170 680,185 700,188 L700,200 L0,200 Z"
          fill="url(#grad2)" />
        <path d="M0,190 C80,185 140,175 200,170 C260,165 320,150 380,155 C440,160 500,158 560,165 C620,170 680,185 700,188"
          fill="none" stroke="#3b82f6" strokeWidth="2" />
      </svg>
    </div>
    <div className="chart-x-labels">
      {WEEK_DAYS.map(d => <span key={d}>{d}</span>)}
    </div>
  </div>
);

// ── Composant principal ───────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab,     setActiveTab]     = useState("dashboard");
  const [stats,         setStats]         = useState<any>(null);
  const [pendingCompanies, setPendingCompanies] = useState<User[]>([]);
  const [users,         setUsers]         = useState<User[]>([]);
  const [offers,        setOffers]        = useState<Offer[]>([]);
  const [applications,  setApplications]  = useState<any[]>([]);
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (activeTab === "dashboard") {
          const [sRes, pcRes, uRes] = await Promise.all([
            api.get("/admin/stats"),
            api.get("/admin/pending-companies"),
            api.get("/admin/users")
          ]);
          setStats(sRes.data);
          setPendingCompanies(pcRes.data);
          setUsers(uRes.data);
        } else if (activeTab === "offers") {
          const res = await api.get("/offers");
          setOffers(res.data);
        } else if (activeTab === "applications") {
          const res = await api.get("/applications/company");
          setApplications(res.data);
        } else if (activeTab === "profile" || activeTab === "notifications") {
          const res = await api.get("/admin/users");
          setUsers(res.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleApproveCompany = async (userId: number | string) => {
    try {
      await api.patch(`/admin/approve/${userId}`, { is_approved: true });
      toast.success("Entreprise approuvée !");
      setPendingCompanies(prev => prev.filter(u => String((u as any)._id || u.id) !== String(userId)));
      // Refresh user list if needed
      api.get("/admin/users").then(res => setUsers(res.data));
    } catch {
      toast.error("Échec de l'approbation");
    }
  };

  const handleOfferAction = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/offers/${id}`, { status });
      toast.success(`Offre ${status}`);
      setPendingOffers(prev => prev.filter(o => (o as any)._id !== id && o.id !== id));
    } catch {
      toast.error("Action échouée");
    }
  };

  const handleDeleteUser = (id: number) => {
    toast("Supprimer cet utilisateur ?", {
      action: {
        label: "Supprimer",
        onClick: async () => {
          try {
            await api.delete(`/admin/users/${id}`);
            toast.success("Utilisateur supprimé");
            setUsers(prev => prev.filter(u => (u as any)._id !== id && u.id !== id));
          } catch {
            toast.error("Échec de la suppression");
          }
        },
      },
    });
  };

  // Statistiques affichées dans les 4 cartes
  const statCards = [
    { label: "Offres totales", value: stats?.offers?.total       ?? 0, iconCls: "astat-icon astat-icon-blue",   Icon: Briefcase   },
    { label: "Candidatures",   value: stats?.applications?.total ?? 0, iconCls: "astat-icon astat-icon-purple", Icon: Users       },
    { label: "Acceptées",      value: stats?.applications?.accepted ?? 0, iconCls: "astat-icon astat-icon-green",  Icon: CheckCircle },
    { label: "En attente",     value: stats?.applications?.pending ?? 0, iconCls: "astat-icon astat-icon-orange", Icon: Clock       },
  ];

  const handleDeleteOffer = (id: any) => {
    toast("Supprimer cette offre ?", {
      action: {
        label: "Supprimer",
        onClick: async () => {
          try {
            await api.delete(`/offers/${id}`);
            toast.success("Offre supprimée");
            setOffers(prev => prev.filter(o => (o as any)._id !== id && o.id !== id));
          } catch {
            toast.error("Échec de la suppression");
          }
        },
      },
    });
  };

  const handleUpdateAppStatus = async (appId: any, status: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      toast.success(`Candidature ${status}`);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch {
      toast.error("Action échouée");
    }
  };

  return (
    <div className="admin-layout">

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item, i) => (
            <button 
               key={i} 
               onClick={() => setActiveTab(item.id)}
               className={`sidebar-link${activeTab === item.id ? " active" : ""}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-help-card">
          <p>Need help?</p>
          <button className="btn-contact-support">Contact Support</button>
        </div>
      </aside>

      {/* ── Contenu principal ──────────────────────────────── */}
      <main className="admin-main">

        {/* En-tête de bienvenue */}
        <div className="admin-page-header">
          <div className="admin-page-greeting">Bonjour, Admin 👋</div>
          <div className="admin-page-subgreeting">
            Voici un résumé de vos activités et de vos recherches de stage.
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center', color: '#64748B' }}>Chargement...</div>
        ) : activeTab === "dashboard" ? (
          <>
            {/* Cartes de statistiques */}
            <div className="admin-stats-row">
              {statCards.map((s, i) => (
                <div key={i} className="astat-card">
                  <div className="astat-header">
                    <div className={s.iconCls}><s.Icon size={22} /></div>
                  </div>
                  <div className="astat-value">{s.value}</div>
                  <div className="astat-label">{s.label}</div>
                  <div className="astat-vs" style={{ opacity: 0.5 }}>Depuis le lancement</div>
                </div>
              ))}
            </div>

            {/* Graphique + Candidatures récentes */}
            <div className="admin-content-grid">
              <ActivityChart />

              <div className="recent-card">
                <div className="recent-card-header">
                  <span className="recent-card-title">Validation des entreprises</span>
                  <span className="recent-see-all">{pendingCompanies.length} en attente</span>
                </div>
                <div className="recent-list">
                  {pendingCompanies.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>
                      Aucune entreprise en attente de validation.
                    </div>
                  ) : (
                    pendingCompanies.map((comp, i) => (
                      <div key={i} className="recent-item">
                        <div className="recent-thumb" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                          {comp.company_name?.[0] || comp.name[0]}
                        </div>
                        <div className="recent-info">
                          <div className="recent-title">{comp.company_name || comp.name}</div>
                          <div className="recent-company">{comp.email}</div>
                        </div>
                        <div className="recent-right">
                          <button 
                            onClick={() => handleApproveCompany((comp as any)._id || comp.id)}
                            className="btn-approve" 
                            style={{ padding: '8px 12px', borderRadius: '8px' }}
                          >
                            ✓ Approuver
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Tableau de gestion des utilisateurs */}
            <div className="chart-card" style={{ marginTop: "1.5rem" }}>
              <div className="chart-card-header">
                <span className="chart-card-title">Gestion des utilisateurs</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Rôle</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={(u as any)._id || u.id || i}>
                        <td>
                          <div className="user-name-cell">{u.name}</div>
                          <div className="user-email-cell">{u.email}</div>
                        </td>
                        <td><span className={roleClass(u.role)}>{u.role}</span></td>
                        <td>
                          {u.role !== "admin" && (
                            <button onClick={() => handleDeleteUser((u as any)._id || u.id)} className="btn-delete">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === "offers" ? (
          <div className="chart-card">
             <div className="chart-card-header">
               <span className="chart-card-title">Toutes les offres de stage</span>
             </div>
             <div style={{ overflowX: "auto" }}>
               <table className="users-table">
                 <thead>
                   <tr>
                     <th>Offre</th>
                     <th>Entreprise</th>
                     <th>Lieu</th>
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {offers.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Aucune offre trouvée</td></tr> : offers.map((o) => (
                     <tr key={o.id}>
                       <td><strong>{o.title}</strong><div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{o.contractType || 'Stage'}</div></td>
                       <td>{o.company_name}</td>
                       <td>{o.location}</td>
                       <td>
                         <button onClick={() => handleDeleteOffer((o as any)._id || o.id)} className="btn-delete">
                           <Trash2 size={18} />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        ) : activeTab === "applications" ? (
          <div className="chart-card">
             <div className="chart-card-header">
               <span className="chart-card-title">Toutes les candidatures</span>
             </div>
             <div style={{ overflowX: "auto" }}>
               <table className="users-table">
                 <thead>
                   <tr>
                     <th>Étudiant</th>
                     <th>Offre</th>
                     <th>Statut</th>
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {applications.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Aucune candidature trouvée</td></tr> : applications.map((a) => (
                     <tr key={a.id}>
                       <td>{a.name}<div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{a.student_email}</div></td>
                       <td>{a.offer_title}</td>
                       <td><span className={statusDotColor(a.status)} style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: a.status === 'accepted' ? '#D1FAE5' : a.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', color: a.status === 'accepted' ? '#059669' : a.status === 'rejected' ? '#B91C1C' : '#D97706' }}>{a.status}</span></td>
                       <td>
                         <div style={{ display: 'flex', gap: '8px' }}>
                           <button onClick={() => handleUpdateAppStatus(a.id, 'accepted')} className="btn-approve" style={{ padding: '4px' }} title="Accepter"><CheckCircle size={16} /></button>
                           <button onClick={() => handleUpdateAppStatus(a.id, 'rejected')} className="btn-delete" style={{ padding: '4px' }} title="Refuser"><Trash2 size={16} /></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '16px', color: '#64748B', marginTop: '24px' }}>
             <LayoutDashboard size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
             <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
             <p>C'est ici que vous gérerez vos {activeTab}.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
