import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBriefcase, 
  FaBuilding, 
  FaUsers,
  FaSearch,
  FaHome,
  FaEnvelope,
  FaBell,
  FaChevronRight,
  FaMapMarkerAlt,
  FaPhone,
  FaRegEnvelope,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook
} from 'react-icons/fa';

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Effet de scroll pour le navbar
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  // On détermine si on est sur la page d'accueil
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled shadow-lg' : ''} fixed-top transition-all`}>
        <div className="container-fluid px-4">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <span className="fs-4 fw-bold">Stage<span className="text-gradient">Finder</span></span>
          </Link>
          
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="d-flex align-items-center order-lg-last">
            {user && (
              <div className="dropdown me-3">
                <button className="btn btn-link text-dark position-relative notification-btn p-1" type="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="notification-icon-container">
                    <FaBell />
                    <span className="notification-badge">2</span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 py-0 overflow-hidden" aria-labelledby="notificationDropdown" style={{minWidth: "320px"}}>
                  <li className="dropdown-header bg-gradient-light py-3 px-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">Notifications</h6>
                      <span className="badge bg-primary rounded-pill">2 nouvelles</span>
                    </div>
                  </li>
                  <li>
                    <a className="dropdown-item py-3 border-bottom notification-item" href="#">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="notification-icon">
                            <FaEnvelope className="text-primary" />
                          </div>
                        </div>
                        <div className="ms-3">
                          <p className="mb-1 fw-semibold">Nouveau message de recruteur</p>
                          <p className="text-muted mb-0 small">L'entreprise ABC a répondu à votre candidature</p>
                          <span className="notification-time">Il y a 10 minutes</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item py-3 notification-item" href="#">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="notification-icon">
                            <FaBriefcase className="text-success" />
                          </div>
                        </div>
                        <div className="ms-3">
                          <p className="mb-1 fw-semibold">Nouvelle offre correspondant à votre profil</p>
                          <p className="text-muted mb-0 small">Stage en développement web à Paris</p>
                          <span className="notification-time">Il y a 2 heures</span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="dropdown-item text-center py-3 border-top bg-light">
                    <Link to="/notifications" className="text-decoration-none fw-semibold text-primary">
                      Voir toutes les notifications <FaChevronRight size={10} className="ms-1" />
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            
            <div className="navbar-nav">
              {!loading && (
                <>
                  {user ? (
                    <div className="dropdown">
                      <button className="btn d-flex align-items-center gap-2 user-dropdown-btn" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        
                        <span className="d-none d-md-block fw-semibold">{user.name}</span>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 py-0 overflow-hidden" aria-labelledby="userDropdown">
                        <li className="dropdown-header bg-gradient-light py-3 px-3">
                          <div className="d-flex align-items-center">
                            <div>
                              <h6 className="mb-0 fw-bold">{user.name}</h6>
                              <small className="text-muted">{user.email}</small>
                            </div>
                          </div>
                        </li>
                        <li><Link to="/dashboard" className="dropdown-item py-2"><FaBriefcase className="me-2 text-primary" /> Tableau de bord</Link></li>
                        <li><Link to="/profil" className="dropdown-item py-2"><FaUserTie className="me-2 text-primary" /> Mon profil</Link></li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        <li>
                          <button className="dropdown-item text-danger py-2" onClick={handleLogout}>
                            <FaSignOutAlt className="me-2" /> Déconnexion
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center auth-buttons">
                      <Link className="btn btn-outline-primary rounded-pill me-2 px-3" to="/login">
                        <FaSignInAlt className="me-1" /> Connexion
                      </Link>
                      <Link className="btn btn-primary rounded-pill px-3" to="/register">
                        <FaUserPlus className="me-1" /> Inscription
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
  <ul className="navbar-nav">
    <li className="nav-item">
      <Link className={`nav-link ${isHomePage ? 'active' : ''}`} to="/">
        <FaHome className="me-1" /> Accueil
      </Link>
    </li>
    {user && (
      <>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/Dashboard' ? 'active' : ''}`} to="/dashboard">
            <FaBriefcase className="me-1" /> Tableau de bord
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/Offre' ? 'active' : ''}`} to="/Offre">
            <FaBriefcase className="me-1" /> Offres de stage
          </Link>
        </li>
        {user.type === 'entreprise' ? (
          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/candidats' ? 'active' : ''}`} to="/candidats">
              <FaUsers className="me-1" /> Candidats
            </Link>
          </li>
        ) : (
          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/entreprises' ? 'active' : ''}`} to="/entreprises">
              <FaBuilding className="me-1" /> Entreprises
            </Link>
          </li>
        )}
      </>
    )}
  </ul>
</div>
        </div>
      </nav>

      <main className="flex-grow-1" style={{ paddingTop: '5rem' }}>
        <Outlet />
      </main>

      <footer className="position-relative overflow-hidden">
        <div className="footer-top-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#6366f1" fillOpacity="0.05" d="M0,256L48,229.3C96,203,192,149,288,138.7C384,128,480,160,576,186.7C672,213,768,235,864,218.7C960,203,1056,149,1152,122.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="py-5 bg-dark position-relative">
          <div className="container py-4">
            <div className="row g-5">
              <div className="col-lg-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="footer-brand-icon-container me-3">
                    <FaGraduationCap className="footer-brand-icon" />
                  </div>
                  <h3 className="mb-0 fw-bold text-white">Stage<span className="text-gradient-footer">Finder</span></h3>
                </div>
                <p className="text-white-50 mb-4">La plateforme qui connecte les étudiants et les entreprises pour des opportunités de stage enrichissantes et des premières expériences professionnelles réussies.</p>
                <div className="d-flex gap-3 social-icons">
                  <a href="#" className="social-icon">
                    <FaFacebook />
                  </a>
                  <a href="#" className="social-icon">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-icon">
                    <FaLinkedin />
                  </a>
                  <a href="#" className="social-icon">
                    <FaInstagram />
                  </a>
                </div>
              </div>
              <div className="col-lg-2 col-md-6">
                <h5 className="text-white mb-4 fw-bold">Navigation</h5>
                <ul className="list-unstyled footer-links">
                  <li><Link to="/">Accueil</Link></li>
                  <li><Link to="/offres">Offres de stage</Link></li>
                  <li><Link to="/entreprises">Entreprises</Link></li>
                  <li><Link to="/a-propos">À propos</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-6">
                <h5 className="text-white mb-4 fw-bold">Ressources</h5>
                <ul className="list-unstyled footer-links">
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/conseils">Conseils CV</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/temoignages">Témoignages</Link></li>
                  <li><Link to="/evenements">Événements</Link></li>
                </ul>
              </div>
              <div className="col-lg-4">
                <h5 className="text-white mb-4 fw-bold">Contactez-nous</h5>
                <ul className="list-unstyled contact-info">
                  <li>
                    <div className="d-flex">
                      <div className="contact-icon">
                        <FaMapMarkerAlt />
                      </div>
                      <span>123 Avenue de l'Innovation, 75001 Paris, France</span>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex">
                      <div className="contact-icon">
                        <FaPhone />
                      </div>
                      <span>+212 123 456 789</span>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex">
                      <div className="contact-icon">
                        <FaRegEnvelope />
                      </div>
                      <span>contact@stagefinder.com</span>
                    </div>
                  </li>
                </ul>
                <div className="mt-4">
                  <h6 className="text-white mb-3">Abonnez-vous à notre newsletter</h6>
                  <div className="newsletter-form">
                    <input type="email" className="newsletter-input" placeholder="Votre email" />
                    <button className="newsletter-button">S'abonner</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-3 bg-darker">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0 text-white-50">&copy; {new Date().getFullYear()} Stage Finder. Tous droits réservés. Développé par Zakaria Rebbah</p>
              </div>
              <div className="col-md-6 text-md-end mt-3 mt-md-0">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <Link to="/mentions-legales" className="text-white-50 text-decoration-none small">Mentions légales</Link>
                  </li>
                  <li className="list-inline-item ms-3">
                    <Link to="/politique-confidentialite" className="text-white-50 text-decoration-none small">Politique de confidentialité</Link>
                  </li>
                  <li className="list-inline-item ms-3">
                    <Link to="/conditions-utilisation" className="text-white-50 text-decoration-none small">CGU</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles personnalisés */}
      <style jsx="true">{`
        /* Variables globales */
        :root {
          --primary-color: #4f46e5;
          --primary-dark: #4338ca;
          --primary-light: #818cf8;
          --secondary-color: #0ea5e9;
          --dark-color: #1e293b;
          --darker-color: #0f172a;
          --light-gray: #f1f5f9;
          --border-radius: 1rem;
          --border-radius-sm: 0.5rem;
          --box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
          --gradient-primary: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
          --transition: all 0.3s ease;
        }
        
        /* Navbar */
        .navbar {
          background-color: rgba(255, 255, 255, 0.95);
          padding-top: 1rem;
          padding-bottom: 1rem;
          backdrop-filter: blur(10px);
          transition: var(--transition);
          z-index: 1030;
        }
        
        .navbar-scrolled {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          background-color: rgba(255, 255, 255, 0.98);
        }
        
        .text-gradient {
          background: var(--gradient-primary);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .text-gradient-footer {
          background: linear-gradient(135deg, #818cf8 0%, #38bdf8 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .brand-icon-container {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        
        .brand-icon {
          font-size: 1.5rem;
          color: white;
        }
        
        /* Navigation Links */
        .nav-link {
          position: relative;
          font-weight: 500;
          padding: 0.5rem 1rem;
          color: var(--dark-color);
          transition: var(--transition);
        }
        
        .nav-link:hover {
          color: var(--primary-color);
        }
        
        .nav-link.active {
          color: var(--primary-color);
          font-weight: 600;
        }
        
        .nav-link.active:after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 20%;
          width: 60%;
          height: 3px;
          background: var(--gradient-primary);
          border-radius: 2px;
        }
        
        /* Search Bar */
        .search-container {
          position: relative;
          width: 100%;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.9rem;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.5rem;
          border-radius: 100px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          transition: var(--transition);
        }
        
        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
          border-color: var(--primary-light);
          background-color: white;
        }
        
        /* Notifications */
        .notification-icon-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: var(--transition);
        }
        
        .notification-icon-container:hover {
          background-color: #e2e8f0;
        }
        
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: var(--gradient-primary);
          color: white;
          border-radius: 50%;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-item {
          transition: var(--transition);
        }
        
        .notification-item:hover {
          background-color: #f8fafc;
        }
        
        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-time {
          font-size: 0.7rem;
          color: #94a3b8;
          display: block;
          margin-top: 4px;
        }
        
        /* User Dropdown */
        .avatar-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .user-dropdown-btn {
          padding: 0.25rem;
          border-radius: var(--border-radius-sm);
          transition: var(--transition);
        }
        
        .user-dropdown-btn:hover {
          background-color: #f1f5f9;
        }
        
        /* Auth Buttons */
        .auth-buttons .btn {
          padding: 0.5rem 1.25rem;
          font-weight: 500;
          transition: var(--transition);
        }
        
        .btn-primary {
          background: var(--gradient-primary);
          border: none;
        }
        
        .btn-primary:hover {
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
          transform: translateY(-2px);
        }
        
        .btn-outline-primary {
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }
        
        .btn-outline-primary:hover {
          background-color: transparent;
          color: var(--primary-dark);
          border-color: var(--primary-dark);
          box-shadow: 0 3px 10px rgba(79, 70, 229, 0.15);
        }
        
        /* Footer */
        .footer-top-wave {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          line-height: 0;
          transform: rotate(180deg);
        }
        
        .footer-top-wave svg {
          width: 100%;
          height: 50px;
        }
        
        .bg-dark {
          background-color: var(--dark-color) !important;
        }
        
        .bg-darker {
          background-color: var(--darker-color) !important;
        }
        
        .footer-brand-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f180 0%, #38bdf880 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .footer-brand-icon {
          font-size: 1.8rem;
          color: white;
        }
        
        .footer-links li {
          margin-bottom: 0.75rem;
        }
        
        .footer-links a {
          color: #cbd5e1;
          text-decoration: none;
          transition: var(--transition);
          display: inline-block;
          position: relative;
        }
        
        .footer-links a:hover {
          color: white;
          transform: translateX(3px);
        }
        
        .footer-links a::before {
          content: "→";
          opacity: 0;
          margin-right: 0;
          display: inline-block;
          transition: var(--transition);
          position: absolute;
          left: -18px;
        }
        
        .footer-links a:hover::before {
          opacity: 1;
          margin-right: 0.5rem;
        }
        
        .contact-info li {
          margin-bottom: 1rem;
          color: #cbd5e1;
        }
        
        .contact-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          color: var(--primary-light);
          flex-shrink: 0;
        }
        
        .social-icons {
          display: flex;
        }
        
        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          transition: var(--transition);
        }
        
        .social-icon:hover {
          background: var(--gradient-primary);
          color: white;
          transform: translateY(-3px);
        }
        
        .newsletter-form {
          position: relative;
          overflow: hidden;
          border-radius: 100px;
        }
        
        .newsletter-input {
          width: 100%;
          padding: 0.75rem 6rem 0.75rem 1.25rem;
          border: none;
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
          border-radius: 100px;
        }
        
        .newsletter-input::placeholder {
          color: #94a3b8;
        }
        
        .newsletter-input:focus {
          outline: none;
        }
        
        .newsletter-button {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          border: none;
          background: var(--gradient-primary);
          color: white;
          padding: 0 1.5rem;
          border-radius: 0 100px 100px 0;
          font-weight: 500;
          transition: var(--transition);
        }
        
        .newsletter-button:hover {
          filter: brightness(1.1);
        }
        
        /* Transition Classes */
        .transition-all {
          transition: var(--transition);
        }
        
        /* Gradient Backgrounds */
        .bg-gradient-primary {
          background: var(--gradient-primary);
        }
        
        .bg-gradient-light {
          background: linear-gradient(to right, #f1f5f9, #ffffff);
        }
        .navbar-nav .nav-item {
          margin: 0 0.5rem;
        }

        .navbar-nav .nav-link {
          padding: 0.5rem 1rem;
        }

        @media (max-width: 991.98px) {
          .navbar-collapse .navbar-nav {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;