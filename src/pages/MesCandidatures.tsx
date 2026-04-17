import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  Search, Bell, FileText, Clock, CheckCircle2, XCircle, TrendingUp,
  MapPin, Briefcase, Calendar, MessageSquare, RotateCcw
} from "lucide-react";
import api from "../api";
import type { Application } from "../types";

// Mock data as fallback to mimic screenshot exactly if backend is empty
const MOCK_APPS = [
  {
    id: 1,
    offer_id: 101,
    offer_title: "Stage Ingénieur Logiciel — IA",
    company_name: "Google France",
    location: "Paris, France",
    duration: "6 mois",
    status: "accepted",
    applied_at: "2026-04-02T10:00:00Z"
  },
  {
    id: 2,
    offer_id: 102,
    offer_title: "Développeur Frontend — React",
    company_name: "Microsoft France",
    location: "Issy-les-Moulineaux",
    duration: "5 mois",
    status: "pending",
    applied_at: "2026-03-15T14:30:00Z"
  },
  {
    id: 3,
    offer_id: 103,
    offer_title: "Stage Data Engineer — Cloud AWS",
    company_name: "Amazon Web Services",
    location: "Lyon, France",
    duration: "4 mois",
    status: "rejected",
    applied_at: "2026-02-08T09:15:00Z"
  }
];

const MesCandidatures = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // all, pending, accepted, rejected, cancelled

  useEffect(() => {
    api.get("/applications/student")
      .then(res => {
        setApplications(res.data);
      })
      .catch(() => {
        toast.error("Impossible de charger vos candidatures.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute stats
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  
  const displayTotal = total;
  const displayPending = pending;
  const displayAccepted = accepted;
  const displayRejected = rejected;
  const displayCancelled = 0;
  const replyRate = displayTotal > 0 ? Math.round(((displayAccepted + displayRejected) / displayTotal) * 100) : 0;
  const displayRate = replyRate;

  // Filter applications
  const filteredApps = applications.filter(app => {
    const title = app.offer_title || app.offerId?.title || "";
    const company = app.company_name || app.offerId?.companyId?.company_name || "";
    const matchesSearch = (title + " " + company).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterMode === "all" || app.status === filterMode;
    return matchesSearch && matchesStatus;
  });

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'accepted': 
        return { label: 'Acceptée', color: '#10B981', bg: '#D1FAE5', dot: '#059669' };
      case 'rejected': 
        return { label: 'Refusée', color: '#EF4444', bg: '#FEE2E2', dot: '#DC2626' };
      case 'pending':
      default:
        return { label: 'En attente', color: '#F59E0B', bg: '#FEF3C7', dot: '#D97706' };
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `Postulé le ${d.getDate()} ${d.toLocaleString('fr-FR', { month: 'long' })} ${d.getFullYear()}`;
  };

  return (
    <div className="page-wrap bg-slate-50" style={{ minHeight: '100vh', padding: '100px 0', marginTop: '40px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* --- HEADER --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
              Mes Candidatures
            </h1>
            <span style={{ 
              background: '#0F9B8E', color: 'white', padding: '4px 12px', 
              borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 
            }}>
              {displayTotal} candidatures
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid var(--gray-200)',
                  background: 'var(--gray-50)', outline: 'none', width: '250px'
                }}
              />
            </div>
            <button style={{ 
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-100)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', position: 'relative'
            }}>
              <Bell size={20} color="var(--gray-600)" />
              <div style={{ position: 'absolute', top: '8px', right: '10px', width: '6px', height: '6px', background: 'red', borderRadius: '50%' }}></div>
            </button>
          </div>
        </div>

        {/* --- FILTERS --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)', fontWeight: 600 }}>Filtrer par :</span>
          
          {[
             { id: 'all', label: 'Toutes', count: displayTotal, activeStyle: { bg: '#0f172a', color: 'white', badge: 'white', badgeText: '#0f172a' } },
             { id: 'pending', label: 'En attente', count: displayPending, activeStyle: { bg: '#FEF3C7', color: '#D97706', badge: '#FDE68A', badgeText: '#D97706' } },
             { id: 'accepted', label: 'Acceptée', count: displayAccepted, activeStyle: { bg: '#D1FAE5', color: '#059669', badge: '#A7F3D0', badgeText: '#059669' } },
             { id: 'rejected', label: 'Refusée', count: displayRejected, activeStyle: { bg: '#FEE2E2', color: '#DC2626', badge: '#FECACA', badgeText: '#DC2626' } },
             { id: 'cancelled', label: 'Annulée', count: displayCancelled, activeStyle: { bg: '#F3F4F6', color: '#4B5563', badge: '#E5E7EB', badgeText: '#4B5563' } }
          ].map(f => {
            const isActive = filterMode === f.id;
            return (
              <button 
                key={f.id}
                onClick={() => setFilterMode(f.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600,
                  border: isActive ? 'none' : '1px solid var(--gray-200)',
                  background: isActive ? f.activeStyle.bg : 'white',
                  color: isActive ? f.activeStyle.color : 'var(--gray-600)',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {f.label}
                <span style={{ 
                  background: isActive ? f.activeStyle.badge : 'var(--gray-100)', 
                  color: isActive ? f.activeStyle.badgeText : 'var(--gray-600)',
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800
                }}>
                  {f.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* --- STATS CARDS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {/* Card 1 */}
          <div style={{ background: '#0F172A', borderRadius: '16px', padding: '20px', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <FileText size={20} color="#94A3B8" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{displayTotal}</div>
            <div style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '8px', fontWeight: 500 }}>Total envoyées</div>
          </div>
          {/* Card 2 */}
          <div style={{ background: '#FFFBEB', borderRadius: '16px', padding: '20px', border: '1px solid #FEF3C7', color: '#D97706', display: 'flex', flexDirection: 'column' }}>
            <Clock size={20} color="#F59E0B" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{displayPending}</div>
            <div style={{ fontSize: '0.875rem', color: '#D97706', marginTop: '8px', fontWeight: 500 }}>En attente</div>
          </div>
          {/* Card 3 */}
          <div style={{ background: '#ECFDF5', borderRadius: '16px', padding: '20px', border: '1px solid #D1FAE5', color: '#059669', display: 'flex', flexDirection: 'column' }}>
            <CheckCircle2 size={20} color="#10B981" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{displayAccepted}</div>
            <div style={{ fontSize: '0.875rem', color: '#059669', marginTop: '8px', fontWeight: 500 }}>Acceptées</div>
          </div>
          {/* Card 4 */}
          <div style={{ background: '#FEF2F2', borderRadius: '16px', padding: '20px', border: '1px solid #FEE2E2', color: '#DC2626', display: 'flex', flexDirection: 'column' }}>
            <XCircle size={20} color="#EF4444" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{displayRejected}</div>
            <div style={{ fontSize: '0.875rem', color: '#DC2626', marginTop: '8px', fontWeight: 500 }}>Refusées</div>
          </div>
          {/* Card 5 */}
          <div style={{ background: '#F0FDFA', borderRadius: '16px', padding: '20px', border: '1px solid #CCFBF1', color: '#0D9488', display: 'flex', flexDirection: 'column' }}>
            <TrendingUp size={20} color="#14B8A6" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{displayRate}%</div>
            <div style={{ fontSize: '0.875rem', color: '#0D9488', marginTop: '8px', fontWeight: 500 }}>Taux de réponse</div>
          </div>
        </div>

        {/* --- APPLICATIONS LIST --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredApps.map((app, index) => {
            const statusInfo = getStatusDisplay(app.status);
            
            return (
              <div key={app.id} style={{ 
                background: 'white', borderRadius: '16px', padding: '24px', 
                border: '1px solid var(--gray-100)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {/* Application Avatar */}
                  <div style={{ 
                    width: '60px', height: '60px', borderRadius: '50%', 
                    background: app.status === 'pending' ? '#EFF6FF' : app.status === 'accepted' ? '#F5F3FF' : '#FEF2F2',
                    color: app.status === 'pending' ? '#3B82F6' : app.status === 'accepted' ? '#8B5CF6' : '#EAB308',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 800, border: `2px solid ${app.status === 'pending' ? '#DBEAFE' : app.status === 'accepted' ? '#EDE9FE' : '#FEF08A'}`
                  }}>
                    {(app.company_name || "C")[0]}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
                      {app.offer_title}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '12px', fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14} /> {app.company_name}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {app.location || "France"}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Stage {app.duration || "6 mois"}</span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                      {formatDate(app.applied_at)}
                    </div>
                  </div>
                </div>

                {/* Actions & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
                  
                  {/* Status Badge */}
                  <div style={{ 
                    background: statusInfo.bg, color: statusInfo.color, padding: '4px 12px',
                    borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusInfo.dot }}></div>
                    {statusInfo.label}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {app.status === 'accepted' && (
                      <>
                        <Link to={`/offers/${app.offer_id}`} style={{ 
                          background: '#0F9B8E', color: 'white', padding: '10px 20px', 
                          borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, 
                          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                          👁 Voir l'offre
                        </Link>
                        <button style={{ 
                          width: '40px', height: '40px', background: '#F4F4F5', border: '1px solid #E4E4E7',
                          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#3B82F6', cursor: 'pointer'
                        }}>
                          <MessageSquare size={18} />
                        </button>
                      </>
                    )}
                    
                    {app.status === 'pending' && (
                      <>
                        <Link to={`/offers/${app.offer_id}`} style={{ 
                          background: '#0F172A', color: 'white', padding: '10px 20px', 
                          borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, 
                          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                          👁 Voir l'offre
                        </Link>
                        <button style={{ 
                          width: '40px', height: '40px', background: '#F4F4F5', border: '1px solid #E4E4E7',
                          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#A1A1AA', cursor: 'pointer'
                        }}>
                          <MessageSquare size={18} />
                        </button>
                      </>
                    )}

                    {app.status === 'rejected' && (
                      <>
                        <Link to={`/offers/${app.offer_id}`} style={{ 
                          background: '#0F172A', color: 'white', padding: '10px 20px', 
                          borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, 
                          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                          👁 Voir l'offre
                        </Link>
                        <button style={{ 
                          background: 'white', border: '1px solid #F97316', color: '#F97316',
                          padding: '10px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}>
                          <RotateCcw size={16} /> Postuler à nouveau
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
          
          {filteredApps.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>
              Aucune candidature trouvée.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MesCandidatures;
