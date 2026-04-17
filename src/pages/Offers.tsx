import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, Tag, X } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import type { Offer } from "../types";
import CreateOfferModal from "../components/CreateOfferModal";

// ─── Types étendus pour les offres (réelles + fictives) ───────────────────────
interface DisplayOffer {
  id: number | string;
  title: string;
  company_name: string;
  location: string;
  duration: string;
  domain?: string;
  contractType?: string;
  initials?: string;
  bgColor?: string;
  time?: string;
}

// DUMMY_OFFERS removed

// ─── Valeurs par défaut des filtres ───────────────────────────────────────────
const DEFAULT_FILTERS = {
  search:   "",
  domain:   "Domaine",
  city:     "Ville",
  duration: "Durée",
  type:     "Type de contrat",
};

// ─── Composant principal ──────────────────────────────────────────────────────
const Offers = () => {
  const { user }                              = useAuth();
  const [realOffers, setRealOffers]           = useState<Offer[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [filters, setFilters]                 = useState(DEFAULT_FILTERS);
  const [searchInput, setSearchInput]         = useState(""); // valeur live de l'input

  // ── Fetch avec query params ───────────────────────────────────────────────
  const fetchOffers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search)                        params.set("search",       filters.search);
    if (filters.domain   !== "Domaine")        params.set("domain",       filters.domain);
    if (filters.city     !== "Ville")          params.set("city",         filters.city);
    if (filters.duration !== "Durée")          params.set("duration",     filters.duration);
    if (filters.type     !== "Type de contrat") params.set("contractType", filters.type);

    api.get(`/offers?${params.toString()}`)
      .then(res => setRealOffers(res.data))
      .catch(() => setRealOffers([]))
      .finally(() => setLoading(false));
  }, [filters]);

  // Re-fetch à chaque changement de filtre (sauf search → déclenché par bouton)
  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilterChange = (key: keyof typeof DEFAULT_FILTERS, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const handleSearch = () =>
    setFilters(prev => ({ ...prev, search: searchInput.trim() }));

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
  };

  const isFiltered = filters.search || filters.domain !== "Domaine" ||
    filters.city !== "Ville" || filters.duration !== "Durée" || filters.type !== "Type de contrat";

  // ── Données affichées : réelles ──
  const displayOffers: DisplayOffer[] = (realOffers as any[]).map(o => ({ ...o, company_name: o.company_name || o.companyId?.company_name }));

  return (
    <div className="page-wrap bg-slate-50" style={{ minHeight: '100vh', padding: '100px 0' }}>

      {/* ── En-tête ────────────────────────────────────────────────────────── */}
      <section className="container" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--gray-900)' }}>
            Offres recommandées
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--gray-500)', margin: '4px 0 0 0' }}>
            <strong style={{ color: 'var(--gray-900)' }}>{displayOffers.length}</strong> stage{displayOffers.length !== 1 ? 's' : ''} correspond{displayOffers.length === 1 ? '' : 'ent'} à vos critères
          </p>
        </div>

        {/* Bouton visible uniquement pour les entreprises */}
        {user?.role === "company" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-indigo"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '12px', fontWeight: 700 }}
          >
            + Ajouter une offre
          </button>
        )}
      </section>

      {/* ── Modal création d'offre ─────────────────────────────────────────── */}
      <CreateOfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOffers}
      />

      {/* ── Barre de recherche texte ───────────────────────────────────────── */}
      <section className="container" style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex', gap: '12px', background: '#fff',
          padding: '12px', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Rechercher un poste, une entreprise, un mot-clé..."
              className="form-input"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{
                paddingLeft: '44px', width: '100%', height: '46px',
                borderRadius: 'var(--radius-lg)', fontSize: '0.9rem',
                border: '1.5px solid var(--gray-100)', background: 'var(--gray-50)'
              }}
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(""); setFilters(p => ({ ...p, search: "" })); }}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="btn btn-indigo"
            style={{ height: '46px', padding: '0 28px', borderRadius: 'var(--radius-lg)', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            Rechercher
          </button>
        </div>
      </section>

      {/* ── Filtres rapides ────────────────────────────────────────────────── */}
      <section className="container" style={{ marginBottom: '2.5rem' }}>
        <div style={{
          background: '#fff', display: 'flex', alignItems: 'center',
          gap: '12px', padding: '12px 20px', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
            Filtres rapides :
          </span>

          {/* Domaine */}
          <select
            className="form-input"
            value={filters.domain}
            onChange={e => handleFilterChange('domain', e.target.value)}
            style={{ width: 'auto', minWidth: '150px', borderRadius: 'var(--radius-lg)', background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)', height: '40px' }}
          >
            <option>Domaine</option>
            <option>IT & Dev</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Data</option>
            <option>Finance</option>
            <option>Commercial</option>
            <option>Management</option>
            <option>RH</option>
          </select>

          {/* Ville */}
          <select
            className="form-input"
            value={filters.city}
            onChange={e => handleFilterChange('city', e.target.value)}
            style={{ width: 'auto', minWidth: '150px', borderRadius: 'var(--radius-lg)', background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)', height: '40px' }}
          >
            <option>Ville</option>
            <option>Paris</option>
            <option>Lyon</option>
            <option>Bordeaux</option>
            <option>Marseille</option>
            <option>Toulouse</option>
            <option>Nantes</option>
            <option>Lille</option>
            <option>Remote</option>
          </select>

          {/* Durée */}
          <select
            className="form-input"
            value={filters.duration}
            onChange={e => handleFilterChange('duration', e.target.value)}
            style={{ width: 'auto', minWidth: '130px', borderRadius: 'var(--radius-lg)', background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)', height: '40px' }}
          >
            <option>Durée</option>
            <option>1 mois</option>
            <option>2 mois</option>
            <option>3 mois</option>
            <option>4 mois</option>
            <option>5 mois</option>
            <option>6 mois</option>
            <option>+6 mois</option>
          </select>

          {/* Type de contrat */}
          <select
            className="form-input"
            value={filters.type}
            onChange={e => handleFilterChange('type', e.target.value)}
            style={{ width: 'auto', minWidth: '170px', borderRadius: 'var(--radius-lg)', background: 'var(--gray-50)', border: '1.5px solid var(--gray-100)', height: '40px' }}
          >
            <option>Type de contrat</option>
            <option>Stage</option>
            <option>Alternance</option>
          </select>

          {/* Bouton Réinitialiser — visible si un filtre actif */}
          {isFiltered && (
            <button
              onClick={handleReset}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-lg)',
                padding: '0 16px', height: '40px', cursor: 'pointer', color: 'var(--gray-500)',
                fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--red-300)', e.currentTarget.style.color = 'var(--red-500)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--gray-200)', e.currentTarget.style.color = 'var(--gray-500)')}
            >
              <X size={14} /> Réinitialiser
            </button>
          )}
        </div>

        {/* Tags des filtres actifs */}
        {isFiltered && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {filters.search && (
              <span style={tagStyle}>
                🔍 "{filters.search}"
                <button onClick={() => { setFilters(p => ({ ...p, search: "" })); setSearchInput(""); }} style={tagCloseStyle}>✕</button>
              </span>
            )}
            {filters.domain !== "Domaine" && (
              <span style={tagStyle}>
                🏢 {filters.domain}
                <button onClick={() => handleFilterChange('domain', 'Domaine')} style={tagCloseStyle}>✕</button>
              </span>
            )}
            {filters.city !== "Ville" && (
              <span style={tagStyle}>
                📍 {filters.city}
                <button onClick={() => handleFilterChange('city', 'Ville')} style={tagCloseStyle}>✕</button>
              </span>
            )}
            {filters.duration !== "Durée" && (
              <span style={tagStyle}>
                🕐 {filters.duration}
                <button onClick={() => handleFilterChange('duration', 'Durée')} style={tagCloseStyle}>✕</button>
              </span>
            )}
            {filters.type !== "Type de contrat" && (
              <span style={tagStyle}>
                📄 {filters.type}
                <button onClick={() => handleFilterChange('type', 'Type de contrat')} style={tagCloseStyle}>✕</button>
              </span>
            )}
          </div>
        )}
      </section>

      {/* ── Grille des offres ──────────────────────────────────────────────── */}
      <section className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            <p>Chargement des offres...</p>
          </div>
        ) : (
          <>
            <div className="featured-grid">
              {displayOffers.map((offer: DisplayOffer) => (
                <div key={offer.id} className="featured-card group" style={{ background: '#fff', border: '1px solid var(--gray-100)', padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div className="company-avatar-sm" style={{
                      backgroundColor: (offer as any).bgColor || 'var(--slate-800)',
                      color: '#fff', borderRadius: '10px', width: '52px', height: '52px'
                    }}>
                      {(offer as any).initials || offer.company_name?.[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: '1.4', marginBottom: '4px' }}>
                        {offer.title}
                      </h3>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500 }}>
                        {offer.company_name}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <div className="nav-link" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'var(--gray-50)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} /> {offer.location}
                    </div>
                    <div className="nav-link" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'var(--blue-50)', color: 'var(--blue-600)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} /> {offer.duration}
                    </div>
                    {offer.domain && (
                      <div className="nav-link" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'var(--indigo-50)', color: 'var(--indigo-600)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Tag size={12} /> {offer.domain}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                      {(offer as any).time || "Aujourd'hui"}
                    </span>
                    <Link
                      to={`/offers/${offer.id}`}
                      className="btn-outline-blue"
                      style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none' }}
                    >
                      Voir l'offre
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {displayOffers.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', color: 'var(--gray-300)' }}><Search size={48} /></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Aucune offre trouvée</h3>
                <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>
                  Modifiez vos filtres ou effectuez une nouvelle recherche.
                </p>
                <button onClick={handleReset} className="btn btn-indigo" style={{ padding: '10px 28px', borderRadius: 'var(--radius-xl)' }}>
                  Voir toutes les offres
                </button>
              </div>
            )}

            {/* Plus d'offres à venir peut-être ? */}
          </>
        )}
      </section>
    </div>
  );
};

// ─── Styles des tags de filtres actifs ───────────────────────────────────────
const tagStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE',
  borderRadius: '20px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 600,
};
const tagCloseStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#93C5FD', fontSize: '12px', padding: '0', lineHeight: 1,
};

export default Offers;
