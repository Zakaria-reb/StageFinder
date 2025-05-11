import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaEuroSign, 
  FaLaptopHouse, 
  FaFilter, 
  FaSearch,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaStar,
  FaRegStar
} from 'react-icons/fa';

const Offre = () => {
  // États
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    domains: [],
    cities: [],
    stageTypes: []
  });
  
  // États pour les filtres actifs
  const [activeFilters, setActiveFilters] = useState({
    domain: '',
    ville: '',
    type_stage: '',
    teletravail: null,
    remunere: null,
    search: ''
  });
  
  // État pour les filtres visibles sur mobile
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
  
  // État pour la pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0
  });
  
  // Récupérer les offres de stage
  const fetchPosts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      // Construire les paramètres de requête
      const params = { ...filters, page };
      
      const response = await axios.get('/api/posts', { params });
      setPosts(response.data.posts.data);
      
      // Mettre à jour les données de pagination
      setPagination({
        currentPage: response.data.posts.current_page,
        lastPage: response.data.posts.last_page,
        perPage: response.data.posts.per_page,
        total: response.data.posts.total
      });
      
      // Mettre à jour les options de filtres disponibles
      if (response.data.filters) {
        setFilters({
          domains: response.data.filters.domain,
          cities: response.data.filters.ville,
          stageTypes: response.data.filters.type_stage
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des offres de stage', err);
      setError('Impossible de charger les offres de stage. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les offres au chargement de la page
  useEffect(() => {
    fetchPosts(1, activeFilters);
  }, []);
  
  // Appliquer les filtres
  const applyFilters = () => {
    fetchPosts(1, activeFilters);
    // Fermer les filtres sur mobile après application
    setMobileFiltersVisible(false);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setActiveFilters({
      domain: '',
      ville: '',
      type_stage: '',
      teletravail: null,
      remunere: null,
      search: ''
    });
    fetchPosts(1, {});
    // Fermer les filtres sur mobile après réinitialisation
    setMobileFiltersVisible(false);
  };
  
  // Gérer le changement de page
  const handlePageChange = (page) => {
    fetchPosts(page, activeFilters);
    // Remonter en haut de la page
    window.scrollTo(0, 0);
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Ajouter ou supprimer des favoris (fonction factice pour l'instant)
  const toggleFavorite = (postId) => {
    console.log(`Toggle favorite for post ${postId}`);
    // Implémenter la logique de favoris ici
  };
  
  return (
    <div className="offres-page py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8">
            <h1 className="fw-bold mb-2">Offres de stage</h1>
            <p className="text-muted">
              Trouvez le stage parfait parmi nos {pagination.total} offres disponibles
            </p>
          </div>
          <div className="col-lg-4 d-flex justify-content-lg-end align-items-center mt-3 mt-lg-0">
            <button 
              className="btn btn-outline-primary d-lg-none rounded-pill me-2"
              onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
            >
              <FaFilter className="me-2" /> 
              {mobileFiltersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
            </button>
            <Link to="/posts/new" className="btn btn-primary rounded-pill">
              <i className="fas fa-plus me-2"></i> Publier une offre
            </Link>
          </div>
        </div>
        
        <div className="row">
          {/* Sidebar de filtres */}
          <div className={`col-lg-3 mb-4 ${mobileFiltersVisible ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="card shadow-sm rounded-4 border-0 overflow-hidden">
              <div className="card-header bg-gradient-light border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <FaFilter className="me-2 text-primary" /> Filtres
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Recherche</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input 
                      type="text" 
                      className="form-control bg-light border-start-0" 
                      placeholder="Mots-clés..."
                      value={activeFilters.search}
                      onChange={(e) => setActiveFilters({...activeFilters, search: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Domaine</label>
                  <select 
                    className="form-select bg-light" 
                    value={activeFilters.domain}
                    onChange={(e) => setActiveFilters({...activeFilters, domain: e.target.value})}
                  >
                    <option value="">Tous les domaines</option>
                    {filters.domains.map((domain, index) => (
                      <option key={index} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Ville</label>
                  <select 
                    className="form-select bg-light"
                    value={activeFilters.ville}
                    onChange={(e) => setActiveFilters({...activeFilters, ville: e.target.value})}
                  >
                    <option value="">Toutes les villes</option>
                    {filters.cities.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Type de stage</label>
                  <select 
                    className="form-select bg-light"
                    value={activeFilters.type_stage}
                    onChange={(e) => setActiveFilters({...activeFilters, type_stage: e.target.value})}
                  >
                    <option value="">Tous les types</option>
                    {filters.stageTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="teletravailSwitch"
                      checked={activeFilters.teletravail === true}
                      onChange={(e) => setActiveFilters({...activeFilters, teletravail: e.target.checked ? true : null})}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="teletravailSwitch">
                      <FaLaptopHouse className="me-1 text-primary" /> Télétravail possible
                    </label>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="remunerationSwitch"
                      checked={activeFilters.remunere === true}
                      onChange={(e) => setActiveFilters({...activeFilters, remunere: e.target.checked ? true : null})}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="remunerationSwitch">
                      <FaEuroSign className="me-1 text-primary" /> Stage rémunéré
                    </label>
                  </div>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <button 
                    className="btn btn-primary rounded-pill" 
                    onClick={applyFilters}
                  >
                    Appliquer les filtres
                  </button>
                  <button 
                    className="btn btn-outline-secondary rounded-pill" 
                    onClick={resetFilters}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Liste des offres */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement des offres de stage...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger rounded-4" role="alert">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <img 
                    src="/images/empty-state.svg" 
                    alt="Aucune offre trouvée" 
                    className="img-fluid" 
                    style={{maxHeight: "200px"}}
                  />
                </div>
                <h3 className="fw-bold">Aucune offre trouvée</h3>
                <p className="text-muted mb-4">
                  Aucune offre de stage ne correspond à vos critères. Essayez d'élargir votre recherche.
                </p>
                <button 
                  className="btn btn-outline-primary rounded-pill px-4" 
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {posts.map(post => (
                  <div key={post.id} className="card shadow-sm border-0 rounded-4 mb-4 position-relative hover-card">
                    <div className="card-body p-4">
                      <div className="row">
                        <div className="col-md-9">
                          <div className="d-flex align-items-center mb-3">
                            <div className="company-logo me-3">
                              <img 
                                src={post.user.avatar || "/images/company-placeholder.jpg"} 
                                alt={post.user.name} 
                                className="rounded-3"
                                width="50" 
                                height="50"
                              />
                            </div>
                            <div>
                              <h5 className="card-title fw-bold mb-1">
                                <Link to={`/PostDetail/${post.id}`} className="text-decoration-none text-dark stretched-link">
                                  {post.title}
                                </Link>
                              </h5>
                              <p className="text-primary mb-0">{post.user.name}</p>
                            </div>
                          </div>
                          
                          <p className="card-text text-muted mb-3 line-clamp-2">
                            {post.description.length > 150 
                              ? post.description.substring(0, 150) + '...' 
                              : post.description}
                          </p>
                          
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                              <FaBriefcase className="me-1 text-primary" /> {post.domain}
                            </span>
                            <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                              <FaMapMarkerAlt className="me-1 text-primary" /> {post.ville}
                            </span>
                            <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                              <FaCalendarAlt className="me-1 text-primary" /> {formatDate(post.date_debut)} - {formatDate(post.date_fin)}
                            </span>
                            {post.teletravail && (
                              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                                <FaLaptopHouse className="me-1 text-primary" /> Télétravail possible
                              </span>
                            )}
                            {post.remunere && (
                              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                                <FaEuroSign className="me-1 text-primary" /> {post.montant_remuneration ? `${post.montant_remuneration}€` : 'Rémunéré'}
                              </span>
                            )}
                          </div>
                          
                          <div className="d-flex flex-wrap gap-1">
                            {post.competences && post.competences.slice(0, 5).map((competence, index) => (
                              <span key={index} className="badge bg-primary-light text-primary rounded-pill">
                                {competence}
                              </span>
                            ))}
                            {post.competences && post.competences.length > 5 && (
                              <span className="badge bg-primary-light text-primary rounded-pill">
                                +{post.competences.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-md-3 mt-3 mt-md-0 d-flex flex-column justify-content-between align-items-md-end">
                          <div className="favorite-btn">
                            <button 
                              className="btn btn-sm btn-light rounded-circle p-2" 
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(post.id);
                              }}
                            >
                              {false ? <FaStar className="text-warning" /> : <FaRegStar />}
                            </button>
                          </div>
                          
                          <div className="mt-auto">
                            <span className="text-muted d-block text-md-end small">
                              Publié le {new Date(post.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {pagination.lastPage > 1 && (
                  <nav aria-label="Page navigation" className="my-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link rounded-start-pill" 
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                        >
                          <FaChevronLeft size={12} />
                        </button>
                      </li>
                      
                      {[...Array(pagination.lastPage).keys()].map(page => {
                        // Afficher uniquement les pages proches de la page courante
                        if (
                          page + 1 === 1 || 
                          page + 1 === pagination.lastPage || 
                          (page + 1 >= pagination.currentPage - 1 && page + 1 <= pagination.currentPage + 1)
                        ) {
                          return (
                            <li 
                              key={page} 
                              className={`page-item ${pagination.currentPage === page + 1 ? 'active' : ''}`}
                            >
                              <button 
                                className="page-link" 
                                onClick={() => handlePageChange(page + 1)}
                              >
                                {page + 1}
                              </button>
                            </li>
                          );
                        } else if (
                          page + 1 === pagination.currentPage - 2 || 
                          page + 1 === pagination.currentPage + 2
                        ) {
                          return (
                            <li key={page} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      
                      <li className={`page-item ${pagination.currentPage === pagination.lastPage ? 'disabled' : ''}`}>
                        <button 
                          className="page-link rounded-end-pill" 
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.lastPage}
                        >
                          <FaChevronRight size={12} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* CSS personnalisé */}
      <style jsx="true">{`
        /* Styles généraux */
.offres-page {
  background-color:rgb(243, 246, 248);
}

/* Style des cartes d'offres */
.hover-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
  border-left: 4px solid #0d6efd;
}

/* Limitation des lignes de texte pour la description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Style des badges */
.badge {
  font-weight: 500;
  padding: 0.5rem 0.75rem;
}

.badge.bg-primary-light {
  background-color: rgba(13, 110, 253, 0.1);
}

/* Style des filtres */
.card-header.bg-gradient-light {
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
}

/* Style pour la pagination */
.pagination .page-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  border-color: #dee2e6;
  margin: 0 2px;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  color: #0d6efd;
  z-index: 1;
}

/* Style pour le bouton de favoris */
.favorite-btn .btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.favorite-btn .btn:hover {
  background-color: #f8f9fa;
  color: #ffc107;
}

/* Améliorations pour la responsivité */
@media (max-width: 767.98px) {
  .card-body {
    padding: 1.25rem !important;
  }
  
  .company-logo img {
    width: 40px;
    height: 40px;
  }
  
  .badge {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
}

/* Effet de focus sur les éléments de filtrage */
.form-select:focus, .form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Animation pour le chargement */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card {
  animation: fadeIn 0.5s ease-in-out;
}

/* Style pour les logos d'entreprise */
.company-logo img {
  object-fit: cover;
  border: 1px solid #e9ecef;
}

/* Style pour les boutons d'action */
.btn-primary {
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.2);
}

.btn-outline-primary:hover {
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.2);
}

/* Style pour l'état vide */
.img-fluid {
  filter: opacity(0.8);
}
        `}
        </style>
        </div>
  )
}

export default Offre;