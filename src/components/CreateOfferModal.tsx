// Formulaire de publication d'offre en 3 étapes — extrait et adapté
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../api";
import { useAuth } from "../context/AuthContext";

// ─── Props ────────────────────────────────────────────────────────────────────
interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── FormData ─────────────────────────────────────────────────────────────────
interface FormData {
  // Étape 1 — Entreprise
  company_name: string;
  sector: string;
  size: string;
  website: string;
  contact_email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  // Étape 2 — Offre
  title: string;
  domain: string;
  location: string;
  duration: string;
  workMode: string;
  contractType: string;
  startDate: string;
  salary: string;
  description: string;
  // Étape 3 — Profil
  level: string;
  experience: string;
  requirements: string;
  languages: string;
  benefits: string;
  deadline: string;
}

const EMPTY_FORM: FormData = {
  company_name: "", sector: "", size: "", website: "",
  contact_email: "", phone: "", address: "", city: "", zip: "", country: "France",
  title: "", domain: "Informatique / IT", location: "", duration: "",
  workMode: "Présentiel", contractType: "Stage", startDate: "", salary: "", description: "",
  level: "", experience: "Aucune expérience", requirements: "", languages: "", benefits: "", deadline: "",
};

// ─── Styles inline (scoped au modal) ─────────────────────────────────────────
const modalStyles = `
  .sc-modal-overlay {
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(15, 20, 50, 0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 48px 16px; overflow-y: auto;
    animation: scFadeIn 0.2s ease;
  }
  @keyframes scFadeIn { from { opacity: 0; } to { opacity: 1; } }

  .sc-modal {
    background: #fff; border-radius: 18px;
    width: 100%; max-width: 700px;
    border: 1px solid #E5E9F2;
    overflow: hidden;
    animation: scSlideIn 0.25s ease;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  }
  @keyframes scSlideIn { from { opacity:0; transform: translateY(-16px); } to { opacity:1; transform: translateY(0); } }

  .sc-modal-header {
    background: linear-gradient(135deg, #3B6CF4 0%, #6a3de8 100%);
    padding: 22px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .sc-modal-header h2 { font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0; }
  .sc-modal-header p  { color: rgba(255,255,255,0.82); font-size: 0.82rem; margin: 4px 0 0 0; }

  .sc-close-btn {
    background: rgba(255,255,255,0.2); border: none; color: #fff;
    width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
    font-size: 16px; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s; flex-shrink: 0;
  }
  .sc-close-btn:hover { background: rgba(255,255,255,0.35); }

  /* Steps bar */
  .sc-steps { display: flex; border-bottom: 1px solid #E5E9F2; }
  .sc-step {
    flex: 1; padding: 13px 10px; text-align: center;
    font-size: 0.8125rem; font-weight: 600; color: #9CA3AF;
    background: #fff; border-right: 1px solid #E5E9F2; cursor: default;
  }
  .sc-step:last-child { border-right: none; }
  .sc-step.active  { color: #3B6CF4; background: #F0F4FF; }
  .sc-step.done    { color: #16a34a; background: #F0FDF4; }

  /* Body */
  .sc-body { padding: 26px 28px; max-height: 60vh; overflow-y: auto; }

  .sc-section-label {
    font-size: 0.72rem; font-weight: 700; color: #3B6CF4;
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #E5E9F2;
  }

  .sc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .sc-grid.one-col { grid-template-columns: 1fr; }
  .sc-field { display: flex; flex-direction: column; gap: 6px; }
  .sc-field.full { grid-column: 1 / -1; }
  .sc-field label { font-size: 0.8125rem; font-weight: 600; color: #1a1d2e; }
  .sc-field .req  { color: #dc2626; margin-left: 2px; }
  .sc-field .hint { font-size: 0.7rem; color: #6b7280; }
  .sc-field input, .sc-field select, .sc-field textarea {
    border: 1.5px solid #E5E9F2; border-radius: 9px;
    padding: 10px 14px; font-size: 0.875rem; color: #1a1d2e;
    font-family: inherit; outline: none; width: 100%;
    background: #fff; transition: border-color 0.2s;
  }
  .sc-field input:focus, .sc-field select:focus, .sc-field textarea:focus { border-color: #3B6CF4; }
  .sc-field textarea { resize: vertical; min-height: 96px; }

  .sc-error {
    background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
    border-radius: 9px; padding: 10px 14px; font-size: 0.8125rem; margin-bottom: 18px;
  }

  /* Footer */
  .sc-footer {
    padding: 18px 28px; background: #F9FAFB;
    border-top: 1px solid #E5E9F2;
    display: flex; align-items: center; justify-content: flex-end; gap: 12px;
  }
  .sc-btn-cancel {
    background: #fff; color: #6b7280; border: 1.5px solid #E5E9F2;
    border-radius: 10px; padding: 10px 22px; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: inherit; transition: border-color 0.2s;
  }
  .sc-btn-cancel:hover { border-color: #9CA3AF; }
  .sc-btn-prev {
    background: #fff; color: #3B6CF4; border: 1.5px solid #3B6CF4;
    border-radius: 10px; padding: 10px 22px; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 6px;
    transition: background 0.2s, color 0.2s;
  }
  .sc-btn-prev:hover { background: #3B6CF4; color: #fff; }
  .sc-btn-next {
    background: #3B6CF4; color: #fff; border: none;
    border-radius: 10px; padding: 10px 28px; font-size: 0.875rem; font-weight: 600;
    cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 8px;
    transition: background 0.2s;
  }
  .sc-btn-next:hover { background: #2a55d4; }
  .sc-btn-next.green { background: #16a34a; }
  .sc-btn-next.green:hover { background: #15803d; }
  .sc-btn-next:disabled { opacity: 0.6; cursor: not-allowed; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
const CreateOfferModal: React.FC<CreateOfferModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState<FormData>({ ...EMPTY_FORM, company_name: user?.company_name || "", contact_email: user?.email || "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  function validate(): boolean {
    if (step === 1 && (!form.company_name || !form.contact_email || !form.address || !form.city)) {
      setError("Veuillez remplir tous les champs obligatoires (*)."); return false;
    }
    if (step === 2 && (!form.title || !form.domain || !form.duration || !form.description)) {
      setError("Veuillez remplir tous les champs obligatoires (*)."); return false;
    }
    if (step === 3 && !form.level) {
      setError("Veuillez sélectionner un niveau d'études."); return false;
    }
    setError(""); return true;
  }

  async function handleNext() {
    if (!validate()) return;
    if (step < 3) { setStep(s => s + 1); return; }

    // Étape 3 → Soumettre
    setLoading(true);
    try {
      // 1. Mettre à jour le profil entreprise
      await api.patch("/auth/profile", {
        company_name:   form.company_name,
        sector:         form.sector,
        size:           form.size,
        website:        form.website,
        contact_email:  form.contact_email,
        phone:          form.phone,
        address:        form.address,
        city:           form.city,
        zip:            form.zip,
        country:        form.country,
      });

      // 2. Créer l'offre
      await api.post("/offers", {
        title:        form.title,
        domain:       form.domain,
        location:     form.location,
        duration:     form.duration,
        workMode:     form.workMode,
        contractType: form.contractType,
        startDate:    form.startDate,
        salary:       form.salary,
        description:  form.description,
        requirements: form.requirements.split("\n").map(r => r.trim()).filter(Boolean),
        level:        form.level,
        experience:   form.experience,
        languages:    form.languages,
        benefits:     form.benefits.split(",").map(b => b.trim()).filter(Boolean),
        deadline:     form.deadline,
      });

      toast.success("Offre publiée avec succès !");
      // Reset
      setForm({ ...EMPTY_FORM, company_name: user?.company_name || "", contact_email: user?.email || "" });
      setStep(1);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setStep(1);
    setError("");
    setForm({ ...EMPTY_FORM, company_name: user?.company_name || "", contact_email: user?.email || "" });
    onClose();
  }

  const stepLabels = ["1 — Entreprise", "2 — Offre", "3 — Profil"];

  return (
    <>
      <style>{modalStyles}</style>
      <div className="sc-modal-overlay" onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
        <div className="sc-modal">

          {/* ── Header ── */}
          <div className="sc-modal-header">
            <div>
              <h2>Publier une offre de stage</h2>
              <p>Remplissez les informations pour diffuser votre annonce</p>
            </div>
            <button className="sc-close-btn" onClick={handleClose}><X size={16} /></button>
          </div>

          {/* ── Steps ── */}
          <div className="sc-steps">
            {stepLabels.map((label, i) => {
              const s = i + 1;
              const cls = s === step ? "active" : s < step ? "done" : "";
              return (
                <div key={s} className={`sc-step ${cls}`}>
                  {s < step ? <CheckCircle size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> : null}
                  {label}
                </div>
              );
            })}
          </div>

          {/* ── Body ── */}
          <div className="sc-body">
            {error && <div className="sc-error">⚠ {error}</div>}

            {/* ÉTAPE 1 — Entreprise */}
            {step === 1 && (
              <>
                <div className="sc-section-label">Coordonnées de l'entreprise</div>
                <div className="sc-grid">
                  <div className="sc-field">
                    <label>Nom de l'entreprise <span className="req">*</span></label>
                    <input value={form.company_name} onChange={set("company_name")} placeholder="Ex: InnovateTech SAS" />
                  </div>
                  <div className="sc-field">
                    <label>Secteur d'activité</label>
                    <select value={form.sector} onChange={set("sector")}>
                      <option value="">Choisir un secteur</option>
                      {["IT & Développement","Marketing & Communication","Design & UX","Finance & Comptabilité","Ressources Humaines","Commerce & Ventes","Management & Stratégie","Data & IA","Juridique","Autre"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="sc-field">
                    <label>Taille de l'entreprise</label>
                    <select value={form.size} onChange={set("size")}>
                      <option value="">Choisir</option>
                      {["1–10 employés (Startup)","11–50 employés (PME)","51–250 employés","251–1000 employés","+1000 employés (Grand groupe)"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="sc-field">
                    <label>Site web</label>
                    <input type="url" value={form.website} onChange={set("website")} placeholder="https://www.entreprise.com" />
                  </div>
                  <div className="sc-field">
                    <label>Email de contact <span className="req">*</span></label>
                    <input type="email" value={form.contact_email} onChange={set("contact_email")} placeholder="rh@entreprise.com" />
                  </div>
                  <div className="sc-field">
                    <label>Téléphone</label>
                    <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+33 1 23 45 67 89" />
                  </div>
                </div>

                <div className="sc-section-label">Adresse du siège</div>
                <div className="sc-grid">
                  <div className="sc-field full">
                    <label>Adresse complète <span className="req">*</span></label>
                    <input value={form.address} onChange={set("address")} placeholder="12 rue de la Paix" />
                  </div>
                  <div className="sc-field">
                    <label>Ville <span className="req">*</span></label>
                    <input value={form.city} onChange={set("city")} placeholder="Paris" />
                  </div>
                  <div className="sc-field">
                    <label>Code postal</label>
                    <input value={form.zip} onChange={set("zip")} placeholder="75001" />
                  </div>
                  <div className="sc-field">
                    <label>Pays</label>
                    <select value={form.country} onChange={set("country")}>
                      {["France","Belgique","Suisse","Maroc","Tunisie","Autre"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* ÉTAPE 2 — Offre */}
            {step === 2 && (
              <>
                <div className="sc-section-label">Informations sur le stage</div>
                <div className="sc-grid">
                  <div className="sc-field full">
                    <label>Titre du poste <span className="req">*</span></label>
                    <input value={form.title} onChange={set("title")} placeholder="Ex: Développeur Frontend React (H/F)" />
                  </div>
                  <div className="sc-field">
                    <label>Domaine <span className="req">*</span></label>
                    <select value={form.domain} onChange={set("domain")}>
                      {["Informatique / IT","Design","Marketing","Finance","Data","Commercial","Management","RH","Autre"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="sc-field">
                    <label>Lieu</label>
                    <input value={form.location} onChange={set("location")} placeholder="Paris, Remote…" />
                  </div>
                  <div className="sc-field">
                    <label>Durée <span className="req">*</span></label>
                    <select value={form.duration} onChange={set("duration")}>
                      <option value="">Choisir</option>
                      {["1 mois","2 mois","3 mois","4 mois","5 mois","6 mois","+6 mois"].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="sc-field">
                    <label>Mode de travail</label>
                    <select value={form.workMode} onChange={set("workMode")}>
                      {["Présentiel","Remote","Hybride"].map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="sc-field">
                    <label>Type de contrat</label>
                    <select value={form.contractType} onChange={set("contractType")}>
                      {["Stage","Alternance"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="sc-field">
                    <label>Date de début</label>
                    <input type="date" value={form.startDate} onChange={set("startDate")} />
                  </div>
                  <div className="sc-field">
                    <label>Gratification mensuelle</label>
                    <input value={form.salary} onChange={set("salary")} placeholder="600 € / mois" />
                  </div>
                  <div className="sc-field full">
                    <label>Description des missions <span className="req">*</span></label>
                    <textarea value={form.description} onChange={set("description")} placeholder="Décrivez les missions du stagiaire, les responsabilités, le contexte..." />
                  </div>
                </div>
              </>
            )}

            {/* ÉTAPE 3 — Profil recherché */}
            {step === 3 && (
              <>
                <div className="sc-section-label">Profil recherché</div>
                <div className="sc-grid">
                  <div className="sc-field">
                    <label>Niveau d'études <span className="req">*</span></label>
                    <select value={form.level} onChange={set("level")}>
                      <option value="">Choisir</option>
                      {["Bac+2 / BTS / DUT","Bac+3 / Licence","Bac+4 / Master 1","Bac+5 / Master 2","Grande École / Ingénieur","Tous niveaux"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="sc-field">
                    <label>Expérience requise</label>
                    <select value={form.experience} onChange={set("experience")}>
                      {["Aucune expérience","Première expérience (stage)","1 an minimum"].map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div className="sc-field full">
                    <label>Compétences requises (un par ligne)</label>
                    <textarea value={form.requirements} onChange={set("requirements")} placeholder="ex. React.js&#10;TypeScript&#10;Figma" />
                    <span className="hint">Une compétence par ligne</span>
                  </div>
                  <div className="sc-field full">
                    <label>Langues</label>
                    <input value={form.languages} onChange={set("languages")} placeholder="Ex: Français (courant), Anglais (intermédiaire)" />
                  </div>
                  <div className="sc-field full">
                    <label>Avantages (séparés par des virgules)</label>
                    <input value={form.benefits} onChange={set("benefits")} placeholder="Télétravail, tickets restaurant, ambiance startup…" />
                  </div>
                  <div className="sc-field">
                    <label>Date limite de candidature</label>
                    <input type="date" value={form.deadline} onChange={set("deadline")} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="sc-footer">
            {step > 1 && (
              <button className="sc-btn-prev" onClick={() => { setError(""); setStep(s => s - 1); }}>
                <ChevronLeft size={16} /> Retour
              </button>
            )}
            <button className="sc-btn-cancel" onClick={handleClose}>Annuler</button>
            <button
              className={`sc-btn-next${step === 3 ? " green" : ""}`}
              onClick={handleNext}
              disabled={loading}
            >
              {step === 3
                ? (loading ? "Publication…" : <><Send size={15} /> Publier l'offre</>)
                : <>Suivant <ChevronRight size={16} /></>
              }
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CreateOfferModal;
