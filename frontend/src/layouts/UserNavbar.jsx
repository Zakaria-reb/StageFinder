import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBriefcase, 
  FaBuilding, 
  FaUsers,
  FaHome,
  FaEnvelope,
  FaBell,
  FaChevronRight
} from 'react-icons/fa';

const UserNavbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté - garde cette vérification pour le lien StageFinder
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
      navigate('/register');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  // On détermine si on est sur la page d'accueil
  const isHomePage = false;

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled shadow-lg' : ''} fixed-top transition-all`}>
      <div className="container-fluid px-4">
        {user ? (
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <span className="fs-4 fw-bold">Stage<span className="text-gradient">Finder</span></span>
        </Link>):(
          <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="fs-4 fw-bold">Stage<span className="text-gradient">Finder</span></span>
        </Link>
        )}
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="d-flex align-items-center order-lg-last">
          {/* Notifications section - Pas besoin de vérifier si l'utilisateur est connecté car il l'est déjà */}
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
          
          <div className="navbar-nav">
            {!loading && (
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
            {/* Navigation items - Pas besoin de vérifier si l'utilisateur est connecté */}
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
            {user && user.type === 'entreprise' ? (
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
          </ul>
        </div>
      </div>
      
      {/* Styles spécifiques au Navbar */}
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
    </nav>
  );
};

export default UserNavbar;