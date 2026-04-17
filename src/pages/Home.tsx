// Page d'accueil : hero, statistiques, étapes, offres vedettes

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, TrendingUp, UserPlus, Search, Star, MapPin, Clock, ArrowRight } from "lucide-react";
import api from "../api";
import type { Offer } from "../types";

// ── Statistiques affichées dans le hero ──────────────────────
const STATS = [
  { icon: Briefcase,  value: "Offres",     label: "Stages variés" },
  { icon: Users,      value: "Communauté",  label: "Large réseau" },
  { icon: TrendingUp, value: "Succès",      label: "Accompagnement" },
];

// ── Étapes "Comment ça marche" ───────────────────────────────
const STEPS = [
  { step: "1", icon: UserPlus, title: "Créez votre profil",    desc: "Inscrivez-vous et complétez votre profil étudiant avec vos compétences et expériences." },
  { step: "2", icon: Search,   title: "Explorez les offres",   desc: "Parcourez des centaines d'offres de stage de toutes les entreprises partenaires." },
  { step: "3", icon: Star,     title: "Décrochez votre stage", desc: "Postulez en un clic et suivez l'état de vos candidatures en temps réel." },
];

const Home = () => {
  const [featuredOffers, setFeaturedOffers] = useState<Offer[]>([]);

  useEffect(() => {
    api.get("/offers")
      .then(res => setFeaturedOffers(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="hero">
        <h1 className="hero-title">Trouvez le stage</h1>
        <h2 className="hero-subtitle">qui lance votre carrière</h2>
        <p className="hero-desc">
          StageConnect met en relation étudiants et entreprises pour des opportunités de stage
          enrichissantes. Plus de 500 offres disponibles.
        </p>
        <div className="hero-actions">
          <Link to="/offers" className="btn btn-gradient">
            Commencer maintenant <ArrowRight size={20} />
          </Link>
          <Link to="/offers" className="btn btn-outline-white">
            Voir les offres
          </Link>
        </div>
      </div>

      {/* ── Statistiques ────────────────────────────────────── */}
      <div className="stats-wrapper">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon"><s.icon size={24} /></div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Comment ça marche ───────────────────────────────── */}
      <div className="section-hiw">
        <div className="section-header">
          <h2 className="section-title">Comment ça marche ?</h2>
          <p className="section-subtitle">Trois étapes simples pour trouver votre stage idéal</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-icon"><s.icon size={28} /></div>
              <div className="step-label">Étape {s.step}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Offres à la une ─────────────────────────────────── */}
      {featuredOffers.length > 0 && (
        <div className="section-featured">
          <div className="featured-inner">
            <div className="section-header">
              <h2 className="section-title">Offres à la une</h2>
              <p className="section-subtitle">Découvrez les dernières opportunités disponibles</p>
            </div>
            <div className="featured-grid">
              {featuredOffers.map(offer => (
                <div key={offer.id} className="featured-card">
                  <div className="featured-card-header">
                    <div className="company-avatar-sm">{offer.company_name?.[0]}</div>
                    <div>
                      <div className="offer-title-sm">{offer.title}</div>
                      <div className="offer-company-sm">{offer.company_name}</div>
                    </div>
                  </div>
                  <div className="offer-meta">
                    <span><MapPin size={12} />{offer.location}</span>
                    <span><Clock size={12} />{offer.duration}</span>
                  </div>
                  <Link to="/offers" className="btn btn-gradient-sm">
                    Voir l'offre <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
            <div className="section-center-btn">
              <Link to="/offers" className="btn btn-outline-blue">
                Voir toutes les offres <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
