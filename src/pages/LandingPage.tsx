import { Search, MapPin, Clock, Filter, ArrowRight, Star, Plus } from 'lucide-react';
const offersData = [
  { id: 1, initials: 'GS', bgColor: 'var(--blue-600)', title: 'Développeur Fullstack React/Node', company: 'Google France', location: 'Paris, France', duration: '6 mois', category: 'Ingénierie', time: '2 heures' },
  { id: 2, initials: 'MS', bgColor: 'var(--emerald)', title: 'UX/UI Designer Junior', company: 'Microsoft', location: 'Lyon (Remote)', duration: '4 mois', category: 'Design', time: '5 heures' },
  { id: 3, initials: 'AM', bgColor: 'var(--yellow-600)', title: 'Data Analyst Intern', company: 'Amazon', location: 'Luxembourg', duration: '6 mois', category: 'Data', time: '1 jour' },
];

const LandingPage = () => {
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
              style={{ paddingLeft: '3.5rem', paddingRight: '12rem', width: '100%', height: '64px', borderRadius: 'var(--radius-xl)', fontSize: '1rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-100)' }}
            />
            <button className="btn-gradient" style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', padding: '0 2rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}>
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
          <select className="form-input" style={{ width: 'auto', minWidth: '180px', padding: '0.625rem 2.5rem 0.625rem 1.25rem' }}>
            <option>Tous les Domaines</option>
            <option>Développement</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>
          <select className="form-input" style={{ width: 'auto', minWidth: '180px', padding: '0.625rem 2.5rem 0.625rem 1.25rem' }}>
            <option>Toutes les Villes</option>
            <option>Paris</option>
            <option>Lyon</option>
            <option>Remote</option>
          </select>
          <button className="btn-outline-blue" style={{ marginLeft: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Réinitialiser</button>
        </div>

        <div className="offers-header" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Offres recommandées</h2>
            <p className="section-subtitle">Basé sur les tendances actuelles du marché</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="nav-link-icon" style={{ color: 'var(--blue-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
              VOIR TOUT <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Grid of Offers using native .featured-grid and .featured-card */}
        <div className="featured-grid">
          {offersData.map((offer) => (
            <div key={offer.id} className="featured-card" style={{ background: '#fff', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
              <div className="featured-card-header" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div className="company-avatar-sm" style={{ backgroundColor: offer.bgColor, color: '#fff', fontSize: '1.25rem', width: '56px', height: '56px', borderRadius: 'var(--radius-xl)' }}>
                  {offer.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="offer-title-sm" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '4px' }}>{offer.title}</div>
                  <div className="offer-company-sm" style={{ color: 'var(--blue-600)', fontWeight: 600 }}>{offer.company}</div>
                </div>
                <button style={{ color: 'var(--gray-300)', background: 'none', border: 'none' }}>
                  <Star size={22} />
                </button>
              </div>
              
              <div className="offer-meta" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--gray-500)' }}><MapPin size={16} /> {offer.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--gray-500)' }}><Clock size={16} /> {offer.duration}</span>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-50)' }}>
                <span className="nav-link-active" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{offer.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>{offer.time}</span>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button className="btn-gradient-sm" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-xl)', fontWeight: 700 }}>Consulter l'offre</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn-outline-blue" style={{ padding: '1rem 3rem', borderRadius: 'var(--radius-xl)', fontSize: '1rem' }}>
            Explorer plus de stages
          </button>
        </div>

      </main>
    </div>
    </>
  );
};

export default LandingPage;
