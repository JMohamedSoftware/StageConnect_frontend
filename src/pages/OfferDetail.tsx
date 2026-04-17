// Page de détail d'une offre - Design Premium (Match Netlify screenshots)

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Clock, Tag, Globe, Calendar, Users, 
  ChevronRight, Share2, Heart, Send, Building2,
  CheckCircle2, Info, ArrowLeft, Zap
} from "lucide-react";
import { toast } from "sonner";
import api from "../api";
import { useAuth } from "../context/AuthContext";

// --- Mock Data Match Screenshot ---
const DUMMY_DETAIL = {
  id: "650c...123",
  title: "Développeur Frontend React (Stage PFE)",
  company_name: "TechVision Innovate",
  company_type: "Startup Tech",
  location: "Tunis, Tunisie",
  duration: "3 à 6 mois",
  domain: "Informatique / IT",
  workMode: "Hybride / Remote",
  publishedAt: "12 Oct 2023",
  deadline: "25 Oct 2023",
  deadlineDiff: "J-3",
  description: "Rejoignez TechVision Innovate, une startup en pleine croissance spécialisée dans les solutions SaaS pour l'éducation. Dans le cadre du développement de notre nouvelle plateforme collaborative, nous recherchons un(e) stagiaire Développeur Frontend React passionné(e) pour intégrer notre équipe technique.\n\nVous serez encadré(e) par notre Lead Tech et travaillerez en étroite collaboration avec les développeurs Backend, le Product Owner et les designers. C'est une excellente opportunité d'acquérir une expérience concrète sur un produit utilisé par des milliers d'utilisateurs.",
  requirements: [
    "Étudiant(e) en dernière année d'école d'ingénieur ou Master en Informatique (Stage PFE).",
    "Solides connaissances en JavaScript moderne (ES6+) et TypeScript.",
    "Une première expérience (projet académique ou personnel) avec React.js et son écosystème (Redux, React Query, etc.).",
    "Sensibilité pour l'UI/UX et maîtrise du HTML/CSS (idéalement Tailwind CSS).",
    "Curiosité, autonomie et forte envie d'apprendre dans un environnement stimulant."
  ],
  benefits: [
    "Gratification de stage attractive selon profil.",
    "Tickets restaurant pris en charge à 50%.",
    "Mentorat par des développeurs Seniors.",
    "Possibilité d'embauche (CDI) à l'issue du stage."
  ],
  companyInfo: {
    sector: "Éditeur de logiciels (SaaS)",
    size: "50 - 200 employés",
    website: "www.techvision.example.com"
  },
  applicants: 42
};

const OfferDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [offer, setOffer] = useState(DUMMY_DETAIL); // Use dummy for preview
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Logic to fetch real offer would go here
    // api.get(`/offers/${id}`).then(res => setOffer(res.data));
  }, [id]);

  const navigate = useNavigate();

  const handleApply = () => {
    if (!user) return toast.error("Veuillez vous connecter pour postuler");
    if (user.role !== 'student') return toast.error("Seuls les étudiants peuvent postuler");
    navigate(`/offers/${id}/apply`);
  };

  return (
    <div className="page-wrap bg-slate-50" style={{ padding: '40px 0 80px 0', marginTop: '64px' }}>
      
      {/* --- Breadcrumbs --- */}
      <nav className="container" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
          <Link to="/" style={{ color: 'var(--gray-400)' }}><Globe size={16} /></Link>
          <ChevronRight size={14} />
          <Link to="/offers" style={{ color: 'var(--gray-500)' }}>Offres</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--gray-900)', fontWeight: 600 }}>{offer.title}</span>
        </div>
      </nav>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        
        {/* --- MAIN COLUMN --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header Card */}
          <div className="featured-card" style={{ padding: '32px', background: '#fff' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div style={{ 
                width: '80px', height: '80px', background: 'var(--slate-900)', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#fff', fontSize: '2rem', fontWeight: 900
              }}>
                <div style={{ margin: 'auto' }}>N</div>
              </div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>
                  {offer.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--blue-600)', fontWeight: 700 }}>{offer.company_name}</span>
                  <span style={{ color: 'var(--gray-300)' }}>•</span>
                  <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{offer.company_type}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <div className="nav-link" style={{ padding: '8px 16px', background: 'var(--gray-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <MapPin size={16} /> {offer.location}
              </div>
              <div className="nav-link" style={{ padding: '8px 16px', background: 'var(--blue-50)', color: 'var(--blue-600)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <Clock size={16} /> {offer.duration}
              </div>
              <div className="nav-link" style={{ padding: '8px 16px', background: 'var(--indigo-50)', color: 'var(--indigo-600)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <Tag size={16} /> {offer.domain}
              </div>
              <div className="nav-link" style={{ padding: '8px 16px', background: 'var(--purple-50)', color: 'var(--purple-600)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <Globe size={16} /> {offer.workMode}
              </div>
            </div>

            <div style={{ 
              display: 'flex', gap: '24px', padding: '20px', background: 'var(--gray-50)', borderRadius: '16px', fontSize: '0.875rem', border: '1px solid var(--gray-100)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-600)' }}>
                <Calendar size={18} /> Publié le: <strong style={{ color: 'var(--gray-900)' }}>{offer.publishedAt}</strong>
              </div>
              <div style={{ width: '1px', background: 'var(--gray-200)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--red-600)' }}>
                <Info size={18} /> Date limite: <strong style={{ fontWeight: 800 }}>{offer.deadline} ({offer.deadlineDiff})</strong>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="featured-card" style={{ padding: '40px', background: '#fff' }}>
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                Description du stage
              </h2>
              <div style={{ whiteSpace: 'pre-line', color: 'var(--gray-600)', lineHeight: '1.8' }}>
                {offer.description}
              </div>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>
                Profil recherché
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {offer.requirements.map((req, i) => (
                  <li key={i} style={{ display: 'flex', gap: '16px', color: 'var(--gray-700)', lineHeight: '1.6' }}>
                    <div style={{ color: 'var(--blue-600)', marginTop: '4px' }}><ChevronRight size={18} /></div>
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>
                Ce que nous offrons
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {offer.benefits.map((benefit, i) => (
                  <div key={i} style={{ 
                    padding: '20px', background: 'var(--blue-50)', borderRadius: '16px', 
                    display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--blue-800)',
                    fontSize: '0.875rem', fontWeight: 600
                  }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--blue-600)', borderRadius: '50%' }}></div>
                    {benefit}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* --- SIDEBAR --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '100px' }}>
          
          {/* Action Card */}
          <div className="featured-card" style={{ padding: '32px', background: '#fff', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '8px' }}>Intéressé(e) par ce stage ?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '24px' }}>Ne tardez pas, cette offre expire bientôt.</p>
            
            <button 
              onClick={handleApply}
              className="btn btn-gradient" 
              style={{ width: '100%', height: '52px', fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
            >
              <Send size={18} /> Postuler maintenant
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <button className="btn-outline-blue" style={{ height: '44px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Heart size={16} /> Sauvegarder
              </button>
              <button className="btn-outline-blue" style={{ height: '44px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Share2 size={16} /> Partager
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--gray-500)', fontSize: '0.8125rem' }}>
              <Users size={16} /> <strong>{offer.applicants} personnes</strong> ont déjà postulé
            </div>
          </div>

          {/* Company Card */}
          <div className="featured-card" style={{ padding: '24px', background: '#fff' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>À propos de l'entreprise</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--slate-900)', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                N
              </div>
              <div>
                <div style={{ fontWeight: 800 }}>{offer.company_name}</div>
                <Link to="#" style={{ fontSize: '0.8125rem', color: 'var(--blue-600)', fontWeight: 600 }}>Voir le profil</Link>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              <div style={{ display: 'flex', gap: '12px' }}><Building2 size={16} /> Secteur : {offer.companyInfo.sector}</div>
              <div style={{ display: 'flex', gap: '12px' }}><Users size={16} /> Taille : {offer.companyInfo.size}</div>
              <div style={{ display: 'flex', gap: '12px' }}><Globe size={16} /> <a href="#" style={{ color: 'var(--blue-600)' }}>{offer.companyInfo.website}</a></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfferDetail;
