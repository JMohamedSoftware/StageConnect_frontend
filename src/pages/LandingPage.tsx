import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Filter, ArrowRight, Star, Plus } from 'lucide-react';
import api from '../api';

const LandingPage = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("Tous les Domaines");
  const [city, setCity] = useState("Toutes les Villes");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch latest offers
    api.get('/offers')
      .then(res => setOffers(res.data.slice(0, 8)))
      .catch(err => console.error("Erreur chargement des offres", err));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (domain !== "Tous les Domaines") params.set("domain", domain);
    if (city !== "Toutes les Villes") params.set("city", city);
    navigate(`/offers?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setDomain("Tous les Domaines");
    setCity("Toutes les Villes");
  };

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'CO';
  const getAvatarColor = (id: number) => {
    const colors = ['var(--blue-600)', 'var(--emerald)', 'var(--yellow-600)', 'var(--purple-600)'];
    return colors[id % colors.length];
  };

  return (
    <>
    <div className="landing-root">
      {/* Navbar handled by App.tsx wrapper */}

      <header className="hero" style={{ paddingBottom: '6rem' }}>
        <h1 className="hero-title">Trouvez votre stage idéal</h1>
        <h2 className="hero-subtitle">et lancez votre carrière</h2>
        <p className="hero-desc">
          Plus de 500 offres de stages dans les meilleures entreprises vous attendent. 
          Propulsez votre avenir dès aujourd'hui avec StageConnect.
        </p>
        
        <div className="container-md" style={{ marginTop: '2.5rem', width: '100%', maxWidth: '650px' }}>
          <div className="search-wrapper" style={{ maxWidth: '100%', position: 'relative' }}>
            <Search className="search-icon" size={22} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input 
              type="text" 
              placeholder="Poste, entreprise, mots-clés..." 
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ paddingLeft: '3.5rem', paddingRight: '12rem', width: '100%', height: '64px', borderRadius: 'var(--radius-xl)', fontSize: '1rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-100)' }}
            />
            <button 
              onClick={handleSearch}
              className="btn-gradient" 
              style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', padding: '0 2rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
            >
              Rechercher
            </button>
          </div>
        </div>
      </header>

      <main id="offres" className="page-wrap" style={{ marginTop: '-4rem' }}>
        {/* Categories / Filters */}
        <div className="container" style={{ marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-100)' }}>
          <div className="nav-link-icon" style={{ color: 'var(--gray-900)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginRight: '1rem' }}>
            <Filter size={20} /> FILTRER PAR
          </div>
          <select 
            className="form-input" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={{ width: 'auto', minWidth: '180px', padding: '0.625rem 2.5rem 0.625rem 1.25rem' }}
          >
            <option>Tous les Domaines</option>
            <option>Développement</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>
          <select 
            className="form-input" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: 'auto', minWidth: '180px', padding: '0.625rem 2.5rem 0.625rem 1.25rem' }}
          >
            <option>Toutes les Villes</option>
            <option>Paris</option>
            <option>Lyon</option>
            <option>Remote</option>
          </select>
          <button 
            onClick={handleReset}
            className="btn-outline-blue" 
            style={{ marginLeft: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
          >
            Réinitialiser
          </button>
        </div>

        <div className="offers-header" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Offres recommandées</h2>
            <p className="section-subtitle">Basé sur les tendances actuelles du marché</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/offers" style={{ textDecoration: 'none' }}>
              <button className="nav-link-icon" style={{ color: 'var(--blue-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', border: 'none', background: 'none', cursor: 'pointer' }}>
                VOIR TOUT <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>

        {/* Grid of Offers using native .featured-grid and .featured-card */}
        <div className="featured-grid">
          {offers.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', color: 'var(--gray-500)' }}>
              Aucune offre disponible pour le moment.
            </div>
          ) : offers.map((offer) => {
            const companyName = offer.companyId?.company_name || offer.companyId?.name || 'Entreprise';
            return (
            <div key={offer.id} className="featured-card" style={{ background: '#fff', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
              <div className="featured-card-header" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div className="company-avatar-sm" style={{ backgroundColor: getAvatarColor(offer.id), color: '#fff', fontSize: '1.25rem', width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {getInitials(companyName)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="offer-title-sm" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '4px' }}>{offer.title}</div>
                  <div className="offer-company-sm" style={{ color: 'var(--blue-600)', fontWeight: 600 }}>{companyName}</div>
                </div>
                <button style={{ color: 'var(--gray-300)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Star size={22} />
                </button>
              </div>
              
              <div className="offer-meta" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--gray-500)' }}><MapPin size={16} /> {offer.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--gray-500)' }}><Clock size={16} /> {offer.duration}</span>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-50)' }}>
                <span className="nav-link-active" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{offer.domain}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>{offer.contract_type}</span>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button 
                  onClick={() => navigate(`/offers/${offer.id}`)}
                  className="btn-gradient-sm" 
                  style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-xl)', fontWeight: 700, cursor: 'pointer', border: 'none' }}
                >
                  Consulter l'offre
                </button>
              </div>
            </div>
          )})}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link to="/offers" style={{ textDecoration: 'none' }}>
            <button className="btn-outline-blue" style={{ padding: '1rem 3rem', borderRadius: 'var(--radius-xl)', fontSize: '1rem', cursor: 'pointer' }}>
              Explorer plus de stages
            </button>
          </Link>
        </div>

      </main>
    </div>
    </>
  );
};

export default LandingPage;
