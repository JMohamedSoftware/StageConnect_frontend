// Tableau de bord entreprise : créer des offres, gérer les candidatures - Design Premium

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus, Briefcase, Users, CheckCircle, XCircle,
  MapPin, Clock, Tag, Calendar, Send, Info, X, Building2, Globe
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import type { Offer, Application } from "../types";

// Badge CSS selon le statut d'une offre
const offerBadge = (status: string) =>
  status === "active" ? "badge-status badge-accepted" :
    status === "pending" ? "badge-status badge-pending" :
      "badge-status badge-rejected";

// État initial du formulaire de création d'offre
const EMPTY_OFFER = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  duration: "",
  domain: "IT & Dev",
  contractType: "Stage",
  deadline: "",
  benefits: "", // Will be converted to array on submit
  workMode: "Présentiel"
};

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newOffer, setNewOffer] = useState(EMPTY_OFFER);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersRes, appsRes] = await Promise.all([
        api.get("/company/offers"),
        api.get("/company/applications")
      ]);
      setOffers(offersRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setNewOffer(prev => ({ ...prev, [field]: e.target.value }));

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Nettoyage des bénéfices : chaîne vers tableau
      const cleanData = {
        ...newOffer,
        benefits: newOffer.benefits.split(",").map(b => b.trim()).filter(b => b !== ""),
        requirements: newOffer.requirements.split("\n").map(r => r.trim()).filter(r => r !== "")
      };

      await api.post("/offers", cleanData);
      toast.success("Offre publiée avec succès !");
      setShowForm(false);
      setNewOffer(EMPTY_OFFER);
      fetchData();
    } catch (err) {
      toast.error("Échec de la création. Vérifiez les champs.");
    }
  };

  const handleStatusUpdate = async (appId: number, status: string) => {
    try {
      await api.patch(`/applications/${appId}`, { status });
      toast.success(`Candidature ${status === 'accepted' ? 'acceptée' : 'rejetée'}`);
      fetchData();
    } catch {
      toast.error("Mise à jour échouée");
    }
  };

  return (
    <div className="page-wrap bg-slate-50" style={{ minHeight: '100vh', padding: '100px 0' }}>

      {/* ── En-tête ─────────────────────────────────────────── */}
      <div className="container" style={{ marginBottom: '40px' }}>
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="dashboard-title" style={{ fontSize: '2rem', fontWeight: 800 }}>Tableau de bord entreprise</h1>
            <p className="dashboard-subtitle" style={{ color: 'var(--gray-500)' }}>Bienvenue, <strong>{user?.company_name || user?.name}</strong></p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-indigo"
            style={{ height: '48px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}
          >
            <Plus size={20} /> Publier une offre
          </button>
        </div>
      </div>

      {/* ── Modal de création d'offre (MAINTAINING RICH AESTHETIC) ──────────────────── */}
      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1000, background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="featured-card" style={{
            width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
            background: '#fff', padding: '40px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button
              onClick={() => setShowForm(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--gray-400)', background: 'none', border: 'none' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '56px', height: '56px', background: 'var(--indigo-600)', borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Building2 size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Créer une offre de stage</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0 }}>
                  Publication en tant que <strong>{user?.company_name}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateOffer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="form-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Titre du poste</label>
                    <input type="text" required className="form-input"
                      value={newOffer.title} onChange={setField("title")}
                      placeholder="ex. Développeur Frontend Stagiaire" style={{ width: '100%' }} />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Domaine</label>
                    <select className="form-input" value={newOffer.domain} onChange={setField("domain")} style={{ width: '100%' }}>
                      <option>IT & Dev</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Data</option>
                      <option>Management</option>
                      <option>Commercial</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Lieu</label>
                      <input type="text" required className="form-input"
                        value={newOffer.location} onChange={setField("location")}
                        placeholder="ex. Tunis" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Durée</label>
                      <input type="text" required className="form-input"
                        value={newOffer.duration} onChange={setField("duration")}
                        placeholder="ex. 6 mois" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Mode de travail</label>
                      <select className="form-input" value={newOffer.workMode} onChange={setField("workMode")} style={{ width: '100%' }}>
                        <option>Présentiel</option>
                        <option>Remote</option>
                        <option>Hybride</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Type</label>
                      <select className="form-input" value={newOffer.contractType} onChange={setField("contractType")} style={{ width: '100%' }}>
                        <option>Stage</option>
                        <option>Alternance</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Description</label>
                    <textarea required rows={4} className="form-input"
                      value={newOffer.description} onChange={setField("description")}
                      placeholder="Décrivez les missions du stage..." style={{ width: '100%', height: '110px' }} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Prérequis (un par ligne)</label>
                    <textarea required rows={3} className="form-input"
                      value={newOffer.requirements} onChange={setField("requirements")}
                      placeholder="ex. React.js&#10;TypeScript" style={{ width: '100%', height: '80px' }} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Bénéfices (séparés par des virgules)</label>
                    <input type="text" className="form-input"
                      value={newOffer.benefits} onChange={setField("benefits")}
                      placeholder="ex. Mentorat, Tickets Resto" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Date limite</label>
                    <input type="date" required className="form-input"
                      value={newOffer.deadline} onChange={setField("deadline")} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid var(--gray-100)' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-blue" style={{ height: '48px', padding: '0 32px' }}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-indigo" style={{ height: '48px', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Send size={18} /> Publier l'offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Offres + Candidatures ───────────────────────────── */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* Vos offres */}
          <div className="featured-card" style={{ background: '#fff', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>
              <Briefcase size={22} color="var(--indigo-600)" /> Vos offres
            </div>
            <div className="items-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {offers.map(offer => (
                <div key={offer.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'var(--gray-50)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{offer.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {offer.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {offer.duration}</span>
                    </div>
                  </div>
                  <span className={offerBadge(offer.status ?? "")} style={{ textTransform: 'capitalize' }}>{offer.status}</span>
                </div>
              ))}
              {offers.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray-400)" }}>
                  <Info size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p>Aucune offre publiée.</p>
                </div>
              )}
            </div>
          </div>

          {/* Candidatures reçues */}
          <div className="featured-card" style={{ background: '#fff', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>
              <Users size={22} color="var(--indigo-600)" /> Candidatures reçues
            </div>
            <div className="items-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map(app => (
                <div key={app.id} style={{ padding: '20px', borderRadius: '20px', background: 'var(--gray-50)', border: '1px solid var(--gray-100)' }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--gray-900)' }}>{app.student_name}</div>
                      <div style={{ color: 'var(--indigo-600)', fontWeight: 600, fontSize: '0.875rem' }}>{app.offer_title}</div>
                    </div>
                    {app.student_cv && (
                      <a href={app.student_cv} target="_blank" rel="noreferrer" className="btn-outline-blue" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>CV</a>
                    )}
                  </div>

                  {app.status === "pending" ? (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => handleStatusUpdate(app.id, "accepted")} className="btn btn-indigo" style={{ flex: 1, height: '36px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <CheckCircle size={14} /> Accepter
                      </button>
                      <button onClick={() => handleStatusUpdate(app.id, "rejected")} className="btn btn-outline-blue" style={{ flex: 1, height: '36px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--red-600)', borderColor: 'var(--red-100)' }}>
                        <XCircle size={14} /> Rejeter
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--gray-200)' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px',
                        background: app.status === 'accepted' ? 'var(--green-100)' : 'var(--red-100)',
                        color: app.status === 'accepted' ? 'var(--green-800)' : 'var(--red-800)'
                      }}>
                        {app.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: "var(--gray-400)" }}>{new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))}
              {applications.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray-400)" }}>
                  <Info size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p>Aucune candidature reçue.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
