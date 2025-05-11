import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaGraduationCap, 
  FaUserTie, 
  FaSearch, 
  FaBriefcase, 
  FaUsers, 
  FaBuilding,
  FaCheckCircle,
  FaChartLine,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaRegStar,
  FaClock
} from 'react-icons/fa';

const Home = () => {
  return (
    <>
      {/* Hero Section with Gradient Background */}
      <section className="py-5 bg-gradient-primary text-white position-relative overflow-hidden">
        <div className="cta-pattern-overlay"></div>
        <div className="container position-relative py-4">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-4 fw-bold mb-4">Prêt à lancer votre carrière ?</h2>
              <p className="lead mb-5">
                Rejoignez notre communauté et accédez à des milliers d'opportunités de stage adaptées à votre profil et à vos ambitions.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/register" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold">
                  <FaUserPlus className="me-2" /> Créer un compte
                </Link>
                <Link to="/offres" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
                  <FaSearch className="me-2" /> Explorer les offres
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="cta-bottom-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,128C96,160,192,224,288,229.3C384,235,480,181,576,165.3C672,149,768,171,864,181.3C960,192,1056,192,1152,165.3C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Companies Section - Carousel Style */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <p className="text-uppercase fw-bold text-muted small letter-spacing-1">Ils nous font confiance</p>
            <div className="divider-center mb-4"><span></span></div>
          </div>
          <div className="company-slider d-flex justify-content-center flex-wrap gap-5 align-items-center">
            <div className="client-logo p-3 bg-white rounded-lg shadow-sm">
              <img src="/images/companies/logo1.png" alt="Société 1" className="img-fluid" style={{ maxHeight: '60px' }} />
            </div>
            <div className="client-logo p-3 bg-white rounded-lg shadow-sm">
              <img src="/images/companies/logo2.png" alt="Société 2" className="img-fluid" style={{ maxHeight: '60px' }} />
            </div>
            <div className="client-logo p-3 bg-white rounded-lg shadow-sm">
              <img src="/images/companies/logo3.png" alt="Société 3" className="img-fluid" style={{ maxHeight: '60px' }} />
            </div>
            <div className="client-logo p-3 bg-white rounded-lg shadow-sm">
              <img src="/images/companies/logo4.png" alt="Société 4" className="img-fluid" style={{ maxHeight: '60px' }} />
            </div>
            <div className="client-logo p-3 bg-white rounded-lg shadow-sm">
              <img src="/images/companies/logo5.png" alt="Société 5" className="img-fluid" style={{ maxHeight: '60px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards with Icons */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-soft text-primary mb-3 px-3 py-2 fw-bold">Comment ça fonctionne</span>
            <h2 className="display-5 fw-bold mb-3">Trouvez votre stage en 3 étapes simples</h2>
            <div className="divider-center mb-4"><span></span></div>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Notre plateforme vous accompagne à chaque étape de votre recherche de stage, de l'inscription jusqu'à l'embauche.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-translate-y transition-all feature-card">
                <div className="card-body p-5 text-center">
                  <div className="feature-icon-wrapper mb-4">
                    <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto">
                      <FaUserPlus size={28} />
                    </div>
                    <div className="feature-icon-bg"></div>
                  </div>
                  <h3 className="h4 mb-3 fw-bold">1. Créez votre profil</h3>
                  <p className="card-text text-muted mb-4">
                    Inscrivez-vous en quelques minutes, remplissez votre profil avec vos compétences et ajoutez votre CV pour attirer l'attention des recruteurs.
                  </p>
                  <Link to="/register" className="btn btn-outline-primary rounded-pill px-4">
                    Commencer maintenant
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-translate-y transition-all feature-card">
                <div className="card-body p-5 text-center">
                  <div className="feature-icon-wrapper mb-4">
                    <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto">
                      <FaSearch size={28} />
                    </div>
                    <div className="feature-icon-bg"></div>
                  </div>
                  <h3 className="h4 mb-3 fw-bold">2. Explorez les offres</h3>
                  <p className="card-text text-muted mb-4">
                    Parcourez notre base de données d'offres de stage, filtrez selon vos critères et trouvez l'opportunité qui correspond à votre projet professionnel.
                  </p>
                  <Link to="/offres" className="btn btn-outline-primary rounded-pill px-4">
                    Découvrir les offres
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-translate-y transition-all feature-card">
                <div className="card-body p-5 text-center">
                  <div className="feature-icon-wrapper mb-4">
                    <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto">
                      <FaUserTie size={28} />
                    </div>
                    <div className="feature-icon-bg"></div>
                  </div>
                  <h3 className="h4 mb-3 fw-bold">3. Postulez et connectez-vous</h3>
                  <p className="card-text text-muted mb-4">
                    Postulez directement aux offres qui vous intéressent, échangez avec les recruteurs et démarrez votre expérience professionnelle.
                  </p>
                  <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">
                    Connectez-vous
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern with Gradient */}
      <section className="py-5 bg-gradient-primary text-white">
        <div className="container py-4">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 rounded-lg bg-white bg-opacity-10">
                <div className="stat-icon mb-3">
                  <FaUsers className="display-4" />
                </div>
                <h2 className="display-4 fw-bold mb-1">5K+</h2>
                <p className="mb-0 text-white-50">Étudiants inscrits</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 rounded-lg bg-white bg-opacity-10">
                <div className="stat-icon mb-3">
                  <FaBuilding className="display-4" />
                </div>
                <h2 className="display-4 fw-bold mb-1">850+</h2>
                <p className="mb-0 text-white-50">Entreprises actives</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 rounded-lg bg-white bg-opacity-10">
                <div className="stat-icon mb-3">
                  <FaBriefcase className="display-4" />
                </div>
                <h2 className="display-4 fw-bold mb-1">1.2K+</h2>
                <p className="mb-0 text-white-50">Stages disponibles</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card p-4 rounded-lg bg-white bg-opacity-10">
                <div className="stat-icon mb-3">
                  <FaCheckCircle className="display-4" />
                </div>
                <h2 className="display-4 fw-bold mb-1">90%</h2>
                <p className="mb-0 text-white-50">Taux de placement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers - Card Grid with Hover Effects */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between mb-5">
            <div>
              <span className="badge bg-primary-soft text-primary mb-2 px-3 py-2 fw-bold">Opportunités récentes</span>
              <h2 className="display-6 fw-bold mb-0">Dernières offres de stage</h2>
            </div>
            <Link to="/offres" className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center">
              <span>Voir toutes les offres</span>
              <i className="ms-2 fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {/* Simulated content for demonstration */}
            {[1, 2, 3].map(i => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm hover-shadow-lg h-100 transition-all job-card">
                  <div className="job-card-header p-4 pb-0 d-flex justify-content-between">
                    <img 
                      src={`/images/companies/company${i}.png`} 
                      alt={`Entreprise ${i}`} 
                      className="rounded company-logo" 
                      width="70" 
                      height="70" 
                    />
                    <span className="badge bg-primary-soft text-primary px-3 py-2">Temps plein</span>
                  </div>
                  <div className="card-body p-4">
                    <h4 className="card-title mb-1 fw-bold">Développeur Web Stagiaire</h4>
                    <p className="text-muted mb-3 d-flex align-items-center">
                      <FaBuilding className="me-2" /> Entreprise Tech {i}
                    </p>
                    <div className="d-flex mb-3 text-muted small">
                      <div className="me-3 d-flex align-items-center">
                        <FaMapMarkerAlt className="me-1" /> Casablanca
                      </div>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-1" /> 6 mois
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-muted mb-0">
                        Rejoignez notre équipe dynamique pour un stage enrichissant dans le développement web et technologies innovantes.
                      </p>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-light text-dark">HTML/CSS</span>
                      <span className="badge bg-light text-dark">JavaScript</span>
                      <span className="badge bg-light text-dark">React</span>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center p-4">
                    <span className="text-muted small d-flex align-items-center">
                      <FaClock className="me-1" /> Il y a 2 jours
                    </span>
                    <Link to={`/offres/${i}`} className="btn btn-primary rounded-pill">
                      Voir détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Cards with Shadows */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-soft text-primary mb-3 px-3 py-2 fw-bold">Témoignages</span>
            <h2 className="display-5 fw-bold mb-3">Ils ont trouvé leur stage avec nous</h2>
            <div className="divider-center mb-4"><span></span></div>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Découvrez les expériences enrichissantes de nos utilisateurs qui ont réussi à décrocher leur stage idéal.
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm testimonial-card position-relative">
                <div className="testimonial-quote">
                  <i className="fas fa-quote-right text-primary-soft fs-1"></i>
                </div>
                <div className="card-body p-4 pt-5">
                  <div className="mb-3 text-warning d-flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="me-1" />
                    ))}
                  </div>
                  <p className="card-text mb-4">
                    "Grâce à Stage Finder, j'ai pu décrocher un stage dans une grande entreprise tech. L'interface intuitive et les conseils personnalisés ont vraiment fait la différence !"
                  </p>
                  <div className="d-flex align-items-center">
                    <img 
                      src="/images/testimonials/user1.jpg" 
                      alt="Témoignage" 
                      className="rounded-circle me-3 border border-3 border-primary" 
                      width="60" 
                      height="60" 
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Sarah Bennani</h6>
                      <small className="text-muted">Étudiante en informatique</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm testimonial-card position-relative">
                <div className="testimonial-quote">
                  <i className="fas fa-quote-right text-primary-soft fs-1"></i>
                </div>
                <div className="card-body p-4 pt-5">
                  <div className="mb-3 text-warning d-flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="me-1" />
                    ))}
                  </div>
                  <p className="card-text mb-4">
                    "En tant que recruteur, Stage Finder nous a permis de trouver des talents motivés et qualifiés. La plateforme est devenue notre outil principal pour le recrutement de stagiaires."
                  </p>
                  <div className="d-flex align-items-center">
                    <img 
                      src="/images/testimonials/user2.jpg" 
                      alt="Témoignage" 
                      className="rounded-circle me-3 border border-3 border-primary" 
                      width="60" 
                      height="60" 
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Karim Alaoui</h6>
                      <small className="text-muted">DRH, TechMaroc</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm testimonial-card position-relative">
                <div className="testimonial-quote">
                  <i className="fas fa-quote-right text-primary-soft fs-1"></i>
                </div>
                <div className="card-body p-4 pt-5">
                  <div className="mb-3 text-warning d-flex">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} className="me-1" />
                    ))}
                    <FaRegStar className="me-1" />
                  </div>
                  <p className="card-text mb-4">
                    "J'étais perdu dans ma recherche de stage, mais Stage Finder m'a guidé et j'ai trouvé une opportunité dans mon domaine en moins de deux semaines. Merci !"
                  </p>
                  <div className="d-flex align-items-center">
                    <img 
                      src="/images/testimonials/user3.jpg" 
                      alt="Témoignage" 
                      className="rounded-circle me-3 border border-3 border-primary" 
                      width="60" 
                      height="60" 
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Yasmine Tazi</h6>
                      <small className="text-muted">Étudiante en marketing</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Section - Modern Design */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="bg-white p-4 p-md-5 rounded-lg shadow-sm creator-section">
            <div className="row align-items-center">
              <div className="col-lg-4 text-center mb-4 mb-lg-0">
                <div className="bg-primary p-1 rounded-circle shadow mx-auto mb-3" style={{ width: '170px', height: '170px' }}>
                  <img 
                    src="/images/creator.jpg" 
                    alt="Zakaria Rebbah" 
                    className="img-fluid rounded-circle" 
                    style={{ width: '160px', height: '160px', objectFit: 'cover' }} 
                  />
                </div>
                <h4 className="mb-1 fw-bold">Zakaria Rebbah</h4>
                <p className="text-muted">Ingénieur Informatique</p>
                <div className="d-flex justify-content-center social-icons">
                  <a href="#" className="me-2 btn btn-sm btn-outline-primary rounded-circle">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="me-2 btn btn-sm btn-outline-primary rounded-circle">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="btn btn-sm btn-outline-primary rounded-circle">
                    <i className="fas fa-globe"></i>
                  </a>
                </div>
              </div>
              <div className="col-lg-8">
                <span className="badge bg-primary-soft text-primary mb-3 px-3 py-2 fw-bold">À propos du créateur</span>
                <h2 className="mb-3 fw-bold">La vision derrière Stage Finder</h2>
                <div className="divider mb-4"><span></span></div>
                <p className="lead">
                  Stage Finder a été développé par <strong>Zakaria Rebbah</strong>, ingénieur informatique passionné par l'innovation et les technologies web.
                </p>
                <p className="mb-4">
                  Avec une expertise en développement full-stack et une vision claire des besoins du marché, Zakaria a créé cette plateforme pour faciliter 
                  la mise en relation entre étudiants et entreprises, contribuant ainsi à l'amélioration de l'insertion professionnelle des jeunes talents.
                </p>
                <Link to="/a-propos" className="btn btn-primary rounded-pill px-4 py-2">
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern with Pattern */}
      

      {/* Add custom CSS for animations and styling */}
      <style jsx>{`
        /* General Styles */
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .text-shadow-sm {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .letter-spacing-1 {
          letter-spacing: 2px;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .hover-shadow:hover {
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
        }
        
        .hover-shadow-lg:hover {
          box-shadow: 0 1rem 3rem rgba(0,0,0,.25) !important;
        }
        
        .hover-translate-y:hover {
          transform: translateY(-5px);
        }
        
        /* Backgrounds */
        .bg-gradient-primary {
          background: linear-gradient(135deg, var(--bs-primary) 0%, #2c4999 100%);
        }
        
        .bg-primary-soft {
          background-color: rgba(13, 110, 253, 0.1);
        }
        
        .bg-success-soft {
          background-color: rgba(25, 135, 84, 0.1);
        }
        
        .bg-info-soft {
          background-color: rgba(13, 202, 240, 0.1);
        }
        
        /* Hero Section */
        .hero-section {
          min-height: 700px;
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }
        
        .container.position-relative {
          z-index: 2;
        }
        
        .hero-wave {
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          z-index: 3;
          line-height: 0;
        }
        
        .hero-wave svg {
          width: 100%;
          height: 70px;
        }
        
        .home-card-1, .home-card-2 {
          z-index: 3;
          transition: all 0.5s ease;
        }
        
        .home-card-1:hover, .home-card-2:hover {
          transform: translateY(-5px);
        }
        
        /* Feature Cards */
        .feature-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }
        
        .feature-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        
        .feature-icon-bg {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background-color: rgba(13, 110, 253, 0.1);
          border-radius: 50%;
          z-index: 1;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
        
        .feature-card:hover .feature-icon {
          background-color: #fff;
          color: var(--bs-primary);
        }
        
        .feature-card:hover .feature-icon-bg {
          background-color: rgba(13, 110, 253, 0.2);
        }
        
        /* Stats Section */
        .stat-card {
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .stat-icon {
          opacity: 0.8;
        }
        
        /* Job Cards */
        .job-card {
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .job-card:hover {
          transform: translateY(-5px);
        }
        
        .job-card .company-logo {
          border: 5px solid #fff;
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
          background-color: #fff;
          transition: all 0.3s ease;
        }
        
        .job-card:hover .company-logo {
          transform: scale(1.05);
        }
        
        /* Testimonial Cards */
        .testimonial-card {
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .testimonial-card:hover {
          transform: translateY(-5px);
        }
        
        .testimonial-quote {
          position: absolute;
          top: 15px;
          right: 20px;
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        
        .testimonial-card:hover .testimonial-quote {
          opacity: 0.5;
          transform: rotate(10deg);
        }
        
        /* Creator Section */
        .creator-section {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }
        
        .social-icons .btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .social-icons .btn:hover {
          background-color: var(--bs-primary);
          color: #fff;
          border-color: var(--bs-primary);
        }
        
        /* CTA Section */
        .cta-pattern-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          opacity: 0.1;
          z-index: 1;
        }
        
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
        
        /* Company Logos */
        .client-logo {
          transition: all 0.3s ease;
        }
        
        .client-logo:hover {
          transform: translateY(-5px);
        }
        
        /* Dividers */
        .divider {
          display: flex;
          align-items: center;
          width: 100%;
          margin: 1rem 0;
        }
        
        .divider::before, .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background-color: rgba(0,0,0,.1);
        }
        
        .divider::before {
          margin-right: 1rem;
        }
        
        .divider-center {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        
        .divider-center span {
          width: 60px;
          height: 4px;
          background-color: var(--bs-primary);
          border-radius: 2px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 500px;
          }
          
          .home-card-1, .home-card-2 {
            display: none;
          }
        }
        
        /* Animations */
        .animate__animated {
          animation-duration: 1s;
          animation-fill-mode: both;
        }
        
        .animate__fadeInUp {
          animation-name: fadeInUp;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}
      </style>
    </>
  );
};

export default Home;