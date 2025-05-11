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
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
  <div className="container-fluid px-4">
    <Link className="navbar-brand d-flex align-items-center" to="/">
      <FaGraduationCap className="me-2 text-primary" size={28} />
      <span className="fs-4">Stage<span className="text-dark">Finder</span></span>
    </Link>
    
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon"></span>
    </button>
    
    <div className="d-flex align-items-center order-lg-last">
      {user && (
        <div className="dropdown me-3">
          <button className="btn btn-link text-dark position-relative p-1" type="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <FaBell size={18} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              2
            </span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="notificationDropdown" style={{minWidth: "280px"}}>
            <li><h6 className="dropdown-header">Notifications</h6></li>
            <li><a className="dropdown-item py-2" href="#">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                    <FaEnvelope className="text-primary" size={14} />
                  </div>
                </div>
                <div className="ms-3">
                  <p className="mb-0 small">Nouveau message</p>
                  <p className="text-muted mb-0 smaller">il y a 10 minutes</p>
                </div>
              </div>
            </a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link to="/notifications" className="dropdown-item text-center text-primary small">Voir toutes les notifications</Link></li>
          </ul>
        </div>
      )}
      
      <div className="navbar-nav">
        {!loading && (
          <>
            {user ? (
              <div className="dropdown">
                <button className="btn d-flex align-items-center gap-2" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <img 
                    src={user.avatar || "/images/avatar-placeholder.jpg"} 
                    alt="Avatar" 
                    className="rounded-circle" 
                    style={{ width: '36px', height: '36px', objectFit: 'cover' }} 
                  />
                  <span className="d-none d-md-block">{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="userDropdown">
                  <li><Link to="/dashboard" className="dropdown-item">Tableau de bord</Link></li>
                  <li><Link to="/profil" className="dropdown-item">Mon profil</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-primary d-flex align-items-center" to="/login">
                    <FaSignInAlt className="me-1" /> Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary d-flex align-items-center" to="/register">
                    <FaUserPlus className="me-1" /> Inscription
                  </Link>
                </li>
              </>
            )}
          </>
        )}
      </div>
    </div>
    
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <Link className={`nav-link ${isHomePage ? 'active' : ''}`} to="/">
            <FaHome className="me-1" /> Accueil
          </Link>
        </li>
        {user && (
          <>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">
                <FaBriefcase className="me-1" /> Tableau de bord
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/offres' ? 'active' : ''}`} to="/offres">
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
      
      <div className="ms-lg-3 me-lg-auto my-2 my-lg-0 position-relative" style={{maxWidth: "400px"}}>
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0" id="search-addon">
            <FaSearch className="text-muted" size={14} />
          </span>
          <input 
            type="text" 
            className="form-control border-start-0 ps-0 bg-light" 
            placeholder="Rechercher..." 
            aria-label="Search" 
            aria-describedby="search-addon" 
          />
        </div>
      </div>
    </div>
  </div>
</nav>

      <main className="flex-grow-1" style={{ paddingTop: '5rem' }}>
        <Outlet />
      </main>

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <FaGraduationCap className="me-2 text-primary" size={24} />
                <h5 className="mb-0">Stage Finder</h5>
              </div>
              <p>La plateforme qui connecte les étudiants et les entreprises pour des opportunités de stage enrichissantes.</p>
            </div>
            <div className="col-md-3">
              <h5>Liens utiles</h5>
              <ul className="list-unstyled">
                <li><Link className="text-white-50 text-decoration-none" to="/">Accueil</Link></li>
                <li><Link className="text-white-50 text-decoration-none" to="/a-propos">À propos</Link></li>
                <li><Link className="text-white-50 text-decoration-none" to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Contact</h5>
              <address className="mb-0">
                <p className="mb-1 text-white-50">Email: contact@stagefinder.com</p>
                <p className="mb-0 text-white-50">Tél: +212 123 456 789</p>
              </address>
            </div>
          </div>
          <hr className="mt-4" />
          <div className="text-center">
            <p className="mb-0 text-white-50">&copy; {new Date().getFullYear()} Stage Finder. Tous droits réservés. Développé par Zakaria Rebbah</p>
          </div>
        </div>
      </footer>

      {/* Styles personnalisés */}
      <style jsx="true">{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #2962ff 0%, #1565c0 100%);
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .navbar {
          padding-top: 15px;
          padding-bottom: 15px;
          transition: all 0.3s ease;
        }
        
        .navbar.navbar-light {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        
        .nav-link {
          position: relative;
          font-weight: 500;
        }
        
        .nav-link.active:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 10%;
          width: 80%;
          height: 2px;
          background-color: currentColor;
        }
      `}</style>
    </div>
  );
};

export default Layout;