import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaSearch,
  FaArrowRight,
  FaGraduationCap,
  FaLaptopCode
} from 'react-icons/fa';

const Home = () => {
  // Animation au défilement
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.8) {
          element.classList.add('animate-visible');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    // Déclencher une fois au chargement
    animateOnScroll();

    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <>
      {/* Hero Section avec effet de parallaxe et éléments flottants */}
      <section className="hero-section py-5 bg-gradient-primary text-white position-relative overflow-hidden">
        {/* Éléments de design flottants */}
        <div className="floating-elements">
          <div className="floating-element floating-1">
            <FaGraduationCap size={32} />
          </div>
          <div className="floating-element floating-2">
            <FaLaptopCode size={28} />
          </div>
          <div className="floating-circle floating-circle-1"></div>
          <div className="floating-circle floating-circle-2"></div>
          <div className="floating-circle floating-circle-3"></div>
        </div>
        
        {/* Pattern overlay */}
        <div className="cta-pattern-overlay"></div>
        
        {/* Contenu principal */}
        <div className="container position-relative py-5 z-index-3">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="badge badge-glow px-4 py-2 mb-4 animate-on-scroll">Votre avenir commence ici</span>
              <h1 className="hero-title fw-bold mb-4 animate-on-scroll">
                Prêt à lancer <span className="highlight-text">votre carrière</span> professionnelle ?
              </h1>
              <p className="lead mb-5 opacity-90 animate-on-scroll">
                Rejoignez notre communauté et accédez à des milliers d'opportunités de stage 
                adaptées à votre profil et à vos ambitions professionnelles.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap animate-on-scroll">
                <Link to="/register" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold pulse-button">
                  <FaUserPlus className="me-2" /> Créer un compte
                </Link>
                <Link to="/offres" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill hover-slide-right">
                  Explorer les offres <FaArrowRight className="ms-2" />
                </Link>
              </div>
              <div className="mt-5 stats-preview animate-on-scroll">
                <div className="row g-3 text-center">
                  <div className="col-4">
                    <div className="stat-item">
                      <div className="stat-value">5K+</div>
                      <div className="stat-label">Étudiants</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <div className="stat-value">850+</div>
                      <div className="stat-label">Entreprises</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <div className="stat-value">90%</div>
                      <div className="stat-label">Placement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vague de transition */}
        <div className="cta-bottom-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,128C96,160,192,224,288,229.3C384,235,480,181,576,165.3C672,149,768,171,864,181.3C960,192,1056,192,1152,165.3C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Reste du contenu... */}

      {/* Styles CSS améliorés */}
      <style jsx>{`
        /* Styles de base améliorés */
        .hero-section {
          min-height: 700px;
          display: flex;
          align-items: center;
          padding-top: 5rem !important;
          padding-bottom: 8rem !important;
          position: relative;
        }
        
        .z-index-3 {
          z-index: 3;
        }
        
        .opacity-90 {
          opacity: 0.9;
        }
        
        /* Dégradé amélioré */
        .bg-gradient-primary {
          background: linear-gradient(135deg, var(--bs-primary) 0%, #1a3a8f 100%);
          position: relative;
        }
        
        /* Pattern overlay avec effet */
        .cta-pattern-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          opacity: 0.07;
          z-index: 1;
        }
        
        /* Animation de texte surligné */
        .highlight-text {
          position: relative;
          display: inline-block;
          color: #fff;
        }
        
        .highlight-text::after {
          content: '';
          position: absolute;
          left: -5px;
          right: -5px;
          bottom: 5px;
          height: 12px;
          background-color: rgba(255, 255, 255, 0.2);
          z-index: -1;
          border-radius: 10px;
        }
        
        /* Hero title avec ombre et taille améliorée */
        .hero-title {
          font-size: 3.5rem;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.5px;
        }
        
        /* Badge avec effet de lueur */
        .badge-glow {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 1px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
        }
        
        /* Animation pulsation pour CTA principal */
        .pulse-button {
          position: relative;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          animation: pulse 2s infinite;
          transition: all 0.3s ease;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        /* Animation au survol pour CTA secondaire */
        .hover-slide-right {
          position: relative;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .hover-slide-right:hover {
          transform: translateX(5px);
          background-color: rgba(255, 255, 255, 0.15);
        }
        
        /* Animation d'apparition au défilement */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-on-scroll.animate-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Délais d'animation pour effet en cascade */
        .animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
        .animate-on-scroll:nth-child(2) { transition-delay: 0.3s; }
        .animate-on-scroll:nth-child(3) { transition-delay: 0.5s; }
        .animate-on-scroll:nth-child(4) { transition-delay: 0.7s; }
        .animate-on-scroll:nth-child(5) { transition-delay: 0.9s; }
        
        /* Éléments flottants */
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        
        .floating-element {
          position: absolute;
          color: rgba(255, 255, 255, 0.2);
          animation-name: floating;
          animation-duration: 3s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        
        .floating-1 {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-2 {
          top: 20%;
          right: 15%;
          animation-delay: 1s;
        }
        
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .floating-circle-1 {
          width: 100px;
          height: 100px;
          top: 25%;
          left: 20%;
          animation: floating 6s infinite ease-in-out;
        }
        
        .floating-circle-2 {
          width: 80px;
          height: 80px;
          bottom: 25%;
          right: 15%;
          animation: floating 8s infinite ease-in-out;
        }
        
        .floating-circle-3 {
          width: 150px;
          height: 150px;
          top: 65%;
          left: 15%;
          animation: floating 10s infinite ease-in-out;
          opacity: 0.05;
        }
        
        @keyframes floating {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, 15px); }
          100% { transform: translate(0, 0px); }
        }
        
        /* Stats mini-section */
        .stats-preview {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .stat-item {
          padding: 0.5rem;
        }
        
        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        /* Vague de transition plus douce */
        .cta-bottom-wave {
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          z-index: 3;
          line-height: 0;
        }
        
        .cta-bottom-wave svg {
          width: 100%;
          height: 70px;
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            min-height: auto;
            padding-top: 4rem !important;
            padding-bottom: 6rem !important;
          }
          
          .hero-title {
            font-size: 2.2rem;
          }
          
          .floating-circle-1,
          .floating-circle-3 {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Home;