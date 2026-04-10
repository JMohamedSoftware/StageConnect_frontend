// Pied de page du site

import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-top">

        {/* Marque */}
        <div>
          <div className="footer-brand-logo">
            <div className="footer-brand-icon"><GraduationCap size={20} /></div>
            <span className="footer-brand-name">StageConnect</span>
          </div>
          <p className="footer-brand-desc">
            La plateforme qui connecte étudiants et entreprises pour des stages enrichissants.
          </p>
        </div>

        {/* Liens Étudiants */}
        <div>
          <div className="footer-col-title">Étudiants</div>
          <ul className="footer-links">
            <li><Link to="/offers">Trouver un stage</Link></li>
            <li><Link to="/register">Créer un compte</Link></li>
          </ul>
        </div>

        {/* Liens Entreprises */}
        <div>
          <div className="footer-col-title">Entreprises</div>
          <ul className="footer-links">
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openOfferModal')); }}>
                Publier une offre
              </a>
            </li>
            <li><Link to="/company">Espace entreprise</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="footer-col-title">Contact</div>
          <div className="footer-contact-item"><Mail size={14} /> contact@stageconnect.fr</div>
          <div className="footer-contact-item"><Phone size={14} /> +33 1 23 45 67 89</div>
        </div>

      </div>
      <div className="footer-bottom">© 2026 StageConnect. Tous droits réservés.</div>
    </div>
  </footer>
);

export default Footer;
