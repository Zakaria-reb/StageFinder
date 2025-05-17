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

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
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

  // On détermine si on est sur la page d'accueil
  const isHomePage = location.pathname === '/';

  const handleLogin = () => {
    navigate('/register');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled shadow-lg' : ''} fixed-top transition-all`}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="fs-4 fw-bold">Stage<span className="text-gradient">Finder</span></span>
        </Link>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="d-flex align-items-center order-lg-last">          
        </div>
        
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${isHomePage ? 'active' : ''}`} to="/">
                <FaHome className="me-1" /> Accueil
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn-link border-0 bg-transparent" onClick={handleLogin}>
                <FaSignInAlt className="me-1" /> Connexion
              </button>
            </li>
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
        
        /* Login button styling */
        .btn-link {
          cursor: pointer;
          text-decoration: none;
        }
        
        .btn-link:hover {
          text-decoration: none;
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

export default Navbar;