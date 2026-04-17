import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "sonner";
import { 
  Search, SlidersHorizontal, Download, 
  Inbox, Clock, CheckCircle2, XCircle, 
  Eye, Check, X, Mail, RotateCcw
} from "lucide-react";

const CandidaturesRecues = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/applications/company");
      setCandidates(res.data);
    } catch (err) {
      toast.error("Impossible de charger les candidatures.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'accepted': 
        return { label: 'Acceptée', bg: '#EDFDF5', text: '#22C55E', dot: '#22C55E' };
      case 'rejected': 
        return { label: 'Refusée', bg: '#FEF2F2', text: '#EF4444', dot: '#EF4444' };
      case 'pending':
      default:
        return { label: 'En attente', bg: '#FFFBEB', text: '#F59E0B', dot: '#F59E0B' };
    }
  };

  const handleAction = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      toast.success(`Candidature ${newStatus === 'accepted' ? 'acceptée' : 'refusée'}`);
      setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="page-wrap bg-slate-50" style={{ minHeight: '100vh', padding: '100px 0 60px', marginTop: '40px' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* --- Header Area --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Candidatures Reçues
            </h1>
            <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
              Gérez toutes les candidatures pour vos offres publiées
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select style={{
              padding: '10px 36px 10px 16px', borderRadius: '8px', border: '1px solid #E2E8F0',
              background: '#fff', color: '#334155', fontSize: '0.9rem', outline: 'none', cursor: 'pointer',
              appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748B\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px'
            }}>
              <option>Toutes les offres</option>
            </select>

            <button style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#0D9488', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#0F766E'}
            onMouseOut={e => e.currentTarget.style.background = '#0D9488'}
            >
              <Download size={16} /> Exporter
            </button>
          </div>
        </div>

        {/* --- Stats Cards --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          {/* Card 1 */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <Inbox size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{candidates.length}</div>
              <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '6px' }}>Total reçues</div>
            </div>
          </div>
          {/* Card 2 */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {candidates.filter(c => c.status === 'pending').length}
              </div>
              <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '6px' }}>En attente</div>
            </div>
          </div>
          {/* Card 3 */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                 {candidates.filter(c => c.status === 'accepted').length}
              </div>
              <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '6px' }}>Acceptées</div>
            </div>
          </div>
          {/* Card 4 */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
              <XCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                 {candidates.filter(c => c.status === 'rejected').length}
              </div>
              <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '6px' }}>Refusées</div>
            </div>
          </div>
        </div>

        {/* --- Main Table Container --- */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          
          {/* Toolbar */}
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} fill="none" strokeWidth={2} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  placeholder="Rechercher un candidat..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 16px 10px 44px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    width: '300px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: '#334155'
                  }}
                />
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0',
                padding: '10px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer'
              }}>
                <SlidersHorizontal size={16} /> Filtrer
              </button>
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              {candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length} candidatures trouvées
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>&nbsp; &nbsp; &nbsp; ÉTUDIANT</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>SPÉCIALITÉ</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>UNIVERSITÉ</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>OFFRE CONCERNÉE</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>DATE</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>STATUT</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {candidates
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((c, index) => {
                const s = getStatusStyle(c.status);
                const isEven = index % 2 === 0;
                
                return (
                  <tr key={c.id} style={{ 
                    borderBottom: '1px solid #F1F5F9', 
                    // Add subtle alternating green-ish tint exactly like screenshot for certain rows? The screenshot has a slight mint/cyan tint on row 1, 3, 5? Actually it looks like #F6FBF9 alternating rows maybe? Or just plain grey striping?
                    // Actually looking at screenshot: Lucas Martin row has a VERY subtle mint tint bg? Amina Benali is white. Karim Ouali is white with subtle grey/mint? Let's use ultra faint mint on odds.
                    background: isEven ? '#F8FCFA' : '#FFFFFF',
                    transition: 'background 0.2s'
                  }}>
                    {/* Student */}
                    <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={c.avatar} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{c.email}</div>
                      </div>
                    </td>
                    
                    {/* Specialty */}
                    <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.9rem' }}>
                      {c.speciality}
                    </td>

                    {/* University */}
                    <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.9rem' }}>
                      {c.university}
                    </td>

                    {/* Offer */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ 
                        background: c.offer.includes('Data') ? '#F3E8FF' : c.offer.includes('UX') ? '#FCE7F3' : c.offer.includes('Marketing') ? '#FFEDD5' : '#EFF6FF', 
                        color: c.offer.includes('Data') ? '#A855F7' : c.offer.includes('UX') ? '#EC4899' : c.offer.includes('Marketing') ? '#F97316' : '#3B82F6', 
                        padding: '6px 12px', 
                        borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                        display: 'inline-block'
                      }}>
                        {c.offer}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '0.9rem' }}>
                      {c.date}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot }}></div>
                        <span style={{ color: s.text, fontSize: '0.85rem', fontWeight: 500 }}>{s.label}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                      {/* View CV - Always present */}
                      <button 
                        onClick={() => c.cv_url && window.open(c.cv_url, '_blank')}
                        disabled={!c.cv_url}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: '#F1F5F9', color: c.cv_url ? '#64748B' : '#CBD5E1', border: 'none',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: c.cv_url ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <Eye size={16} /> CV
                      </button>

                      {c.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAction(c.id, 'accepted')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              background: '#22C55E', color: 'white', border: 'none',
                              padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'
                            }}
                          >
                            <Check size={16} /> Accepter
                          </button>
                          <button 
                            onClick={() => handleAction(c.id, 'rejected')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              background: 'transparent', color: '#EF4444', border: '1px solid #FECACA',
                              padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'
                            }}
                          >
                            <X size={16} /> Refuser
                          </button>
                        </>
                      )}

                      {c.status === 'accepted' && (
                        <button 
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: '#EFF6FF', color: '#3B82F6', border: '1px solid #DBEAFE',
                            padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'
                          }}
                        >
                          <Mail size={16} /> Contacter
                        </button>
                      )}

                      {c.status === 'rejected' && (
                        <button 
                          onClick={() => handleAction(c.id, 'pending')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0',
                            padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'
                          }}
                        >
                          <RotateCcw size={16} /> Reconsidérer
                        </button>
                      )}

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default CandidaturesRecues;
