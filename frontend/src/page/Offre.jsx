import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../layouts/UserNavbar';
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
  FaRegStar,
  FaGlobe
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
      setError('Unable to load opportunities. Please try again later.');
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
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Ajouter ou supprimer des favoris (fonction factice pour l'instant)
  const toggleFavorite = (postId) => {
    console.log(`Toggle favorite for post ${postId}`);
    // Implémenter la logique de favoris ici
  };
  
  return (
    <div className="global-listings">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="hero-title">Global Opportunities</h1>
              <p className="hero-subtitle">Find your perfect internship among {pagination.total} worldwide opportunities</p>
            </div>
            <div className="col-lg-5">
              <div className="search-container">
                <div className="input-group">
                  <span className="input-group-text border-0">
                    <FaSearch />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-0" 
                    placeholder="Search by keywords..."
                    value={activeFilters.search}
                    onChange={(e) => setActiveFilters({...activeFilters, search: e.target.value})}
                  />
                  <button 
                    className="btn btn-primary rounded-end"
                    onClick={applyFilters}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container main-content">
        <div className="row">
          <div className="col-lg-12 mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="listings-summary">
                <span className="total-count">{pagination.total}</span> opportunities available
              </div>
              <div className="actions">
                <button 
                  className="btn btn-outline-primary d-lg-none me-2"
                  onClick={() => setMobileFiltersVisible(!mobileFiltersVisible)}
                >
                  <FaFilter className="me-1" /> 
                  {mobileFiltersVisible ? 'Hide Filters' : 'Filters'}
                </button>
                <Link to="/posts/new" className="btn btn-primary">
                  Post New Opportunity
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row g-4">
          {/* Sidebar de filtres */}
          <div className={`col-lg-3 mb-4 ${mobileFiltersVisible ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="filters-panel">
              <div className="filters-header">
                <h5><FaFilter className="me-2" /> Filters</h5>
              </div>
              
              <div className="filters-body">
                <div className="filter-group">
                  <label>Field</label>
                  <select 
                    className="form-select" 
                    value={activeFilters.domain}
                    onChange={(e) => setActiveFilters({...activeFilters, domain: e.target.value})}
                  >
                    <option value="">All Fields</option>
                    {filters.domains.map((domain, index) => (
                      <option key={index} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Location</label>
                  <select 
                    className="form-select"
                    value={activeFilters.ville}
                    onChange={(e) => setActiveFilters({...activeFilters, ville: e.target.value})}
                  >
                    <option value="">All Locations</option>
                    {filters.cities.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Internship Type</label>
                  <select 
                    className="form-select"
                    value={activeFilters.type_stage}
                    onChange={(e) => setActiveFilters({...activeFilters, type_stage: e.target.value})}
                  >
                    <option value="">All Types</option>
                    {filters.stageTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="teletravailSwitch"
                      checked={activeFilters.teletravail === true}
                      onChange={(e) => setActiveFilters({...activeFilters, teletravail: e.target.checked ? true : null})}
                    />
                    <label className="form-check-label" htmlFor="teletravailSwitch">
                      <FaLaptopHouse className="me-1" /> Remote Available
                    </label>
                  </div>
                </div>
                
                <div className="filter-group">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="remunerationSwitch"
                      checked={activeFilters.remunere === true}
                      onChange={(e) => setActiveFilters({...activeFilters, remunere: e.target.checked ? true : null})}
                    />
                    <label className="form-check-label" htmlFor="remunerationSwitch">
                      <FaEuroSign className="me-1" /> Paid Only
                    </label>
                  </div>
                </div>
                
                <div className="filter-actions">
                  <button 
                    className="btn btn-primary w-100 mb-2" 
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                  <button 
                    className="btn btn-outline-secondary w-100" 
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Liste des offres */}
          <div className="col-lg-9">
            <div className="listings-container">
              {loading ? (
                <div className="loader-container">
                  <div className="loader-spinner"></div>
                  <p>Loading opportunities...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <div className="alert-icon">⚠️</div>
                  <h4>Error</h4>
                  <p>{error}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="empty-container">
                  <div className="empty-icon">🔍</div>
                  <h3>No Opportunities Found</h3>
                  <p>No internship opportunities match your criteria. Try adjusting your filters.</p>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  {posts.map(post => (
                    <div key={post.id} className="opportunity-card">
                      <div className="card-body">
                        <div className="row g-0">
                          <div className="col-lg-9">
                            <div className="card-header-content">
            
                              <div className="title-container">
                                <Link to={`/PostDetail/${post.id}`} className="opportunity-title">
                                  {post.title}
                                </Link>
                                <div className="company-name">{post.user.name}</div>
                              </div>
                            </div>
                            
                            <div className="opportunity-description">
                              {post.description.length > 150 
                                ? post.description.substring(0, 150) + '...' 
                                : post.description}
                            </div>
                            
                            <div className="opportunity-meta">
                              <div className="meta-item">
                                <FaBriefcase /> {post.domain}
                              </div>
                              <div className="meta-item">
                                <FaMapMarkerAlt /> {post.ville}
                              </div>
                              <div className="meta-item">
                                <FaCalendarAlt /> {formatDate(post.date_debut)}
                              </div>
                              {post.teletravail && (
                                <div className="meta-item">
                                  <FaLaptopHouse /> Remote
                                </div>
                              )}
                              {post.remunere && (
                                <div className="meta-item">
                                  <FaEuroSign /> {post.montant_remuneration ? `${post.montant_remuneration}€` : 'Paid'}
                                </div>
                              )}
                            </div>
                            
                            <div className="skills-container">
                              {post.competences && post.competences.slice(0, 5).map((competence, index) => (
                                <span key={index} className="skill-tag">
                                  {competence}
                                </span>
                              ))}
                              {post.competences && post.competences.length > 5 && (
                                <span className="skill-tag tag-more">
                                  +{post.competences.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="col-lg-3">
                            <div className="card-actions">
                              <button 
                                className="favorite-btn" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleFavorite(post.id);
                                }}
                              >
                                {false ? <FaStar className="text-warning" /> : <FaRegStar />}
                              </button>
                              
                              <div className="post-date">
                                Posted on {new Date(post.created_at).toLocaleDateString('en-US')}
                              </div>
                              
                              <Link to={`/PostDetail/${post.id}`} className="btn btn-outline-primary btn-sm view-details">
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {pagination.lastPage > 1 && (
                    <div className="pagination-container">
                      <button 
                        className={`pagination-prev ${pagination.currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                      >
                        <FaChevronLeft />
                      </button>
                      
                      <div className="pagination-pages">
                        {[...Array(pagination.lastPage).keys()].map(page => {
                          // Afficher uniquement les pages proches de la page courante
                          if (
                            page + 1 === 1 || 
                            page + 1 === pagination.lastPage || 
                            (page + 1 >= pagination.currentPage - 1 && page + 1 <= pagination.currentPage + 1)
                          ) {
                            return (
                              <button 
                                key={page} 
                                className={`pagination-page ${pagination.currentPage === page + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(page + 1)}
                              >
                                {page + 1}
                              </button>
                            );
                          } else if (
                            page + 1 === pagination.currentPage - 2 || 
                            page + 1 === pagination.currentPage + 2
                          ) {
                            return (
                              <span key={page} className="pagination-ellipsis">...</span>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <button 
                        className={`pagination-next ${pagination.currentPage === pagination.lastPage ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS personnalisé */}
      <style jsx="true">{`
/* Base and Variables */
:root {
  --primary: #2563eb;
  --primary-light: rgba(37, 99, 235, 0.1);
  --secondary: #64748b;
  --success: #10b981;
  --info: #0ea5e9;
  --warning: #f59e0b;
  --danger: #ef4444;
  --dark: #1e293b;
  --light: #f1f5f9;
  --white: #ffffff;
  --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
  --border-radius: 12px;
}

/* Global Styles */
.global-listings {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  color: #334155;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, var(--primary) 0%, #1e40af 100%);
  padding: 4rem 0;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='white' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  z-index: 0;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.search-container {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: var(--border-radius);
  padding: 0.5rem;
}

.search-container .input-group {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.search-container .input-group-text {
  background: white;
  color: var(--secondary);
  padding-left: 1rem;
}

.search-container .form-control {
  height: 50px;
}

.search-container .btn {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* Main Content */
.main-content {
  padding: 2rem 0;
  position: relative;
  margin-top: -1rem;
  z-index: 1;
}

.listings-summary {
  font-size: 1.1rem;
  color: var(--secondary);
}

.total-count {
  font-weight: 700;
  color: var(--primary);
}

/* Filters Panel */
.filters-panel {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.filters-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--light);
}

.filters-header h5 {
  font-weight: 600;
  margin: 0;
  color: var(--dark);
  display: flex;
  align-items: center;
}

.filters-body {
  padding: 1.25rem;
}

.filter-group {
  margin-bottom: 1.25rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark);
}

.form-select, .form-control {
  background-color: var(--light);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.form-check-label {
  font-weight: 500;
  display: flex;
  align-items: center;
}

.filter-actions {
  margin-top: 1.5rem;
}

/* Opportunity Cards */
.opportunity-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  margin-bottom: 1.5rem;
  transition: var(--transition);
  border-left: 4px solid transparent;
}

.opportunity-card:hover {
  transform: translateY(-5px);
  border-left: 4px solid var(--primary);
}

.card-body {
  padding: 1.5rem;
}

.card-header-content {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--light);
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--light);
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title-container {
  flex: 1;
}

.opportunity-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--dark);
  text-decoration: none;
  margin-bottom: 0.25rem;
  display: block;
}

.opportunity-title:hover {
  color: var(--primary);
}

.company-name {
  color: var(--primary);
  font-weight: 500;
}

.opportunity-description {
  color: var(--secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.opportunity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--secondary);
  background: var(--light);
  padding: 0.5rem 0.75rem;
  border-radius: 50px;
}

.meta-item svg {
  margin-right: 0.5rem;
  color: var(--primary);
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: var(--primary-light);
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tag-more {
  background: var(--light);
  color: var(--secondary);
}

.card-actions {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.post-date {
  font-size: 0.85rem;
  color: var(--secondary);
  margin-bottom: 1rem;
}

.favorite-btn {
  background: none;
  border: none;
  color: var(--secondary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  margin-bottom: 1rem;
  transition: var(--transition);
}

.favorite-btn:hover {
  color: var(--warning);
  transform: scale(1.1);
}

.view-details {
  width: 100%;
  margin-top: auto;
}

/* Loader */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.loader-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--light);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-container, .error-container {
  text-align: center;
  padding: 4rem 0;
}

.empty-icon, .alert-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Pagination */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.pagination-prev, .pagination-next {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dark);
  background: white;
  border: 1px solid var(--light);
  cursor: pointer;
  transition: var(--transition);
}

.pagination-prev:hover, .pagination-next:hover {
  background: var(--light);
}

.pagination-pages {
  display: flex;
  align-items: center;
  margin: 0 1rem;
}

.pagination-page {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.25rem;
  background: white;
  border: 1px solid var(--light);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.pagination-page:hover {
  background: var(--light);
}

.pagination-page.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.pagination-ellipsis {
  margin: 0 0.25rem;
  color: var(--secondary);
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Adjustments */
@media (max-width: 991.98px) {
  .hero-banner {
    padding: 3rem 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .search-container {
    margin-top: 1.5rem;
  }
  
  .card-header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .company-logo {
    margin-bottom: 1rem;
  }
  
  .opportunity-meta {
    flex-wrap: wrap;
  }
  
  .meta-item {
    margin-bottom: 0.5rem;
  }
  
  .card-actions {
    margin-top: 1.5rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .favorite-btn, .post-date {
    margin-bottom: 0;
  }
  
  .view-details {
    width: auto;
  }
}

@media (max-width: 767.98px) {
  .hero-title {
    font-size: 1.75rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .opportunity-title {
    font-size: 1.1rem;
  }
  
  .card-body {
    padding: 1.25rem;
  }
  
  .opportunity-meta {
    gap: 0.5rem;
  }
  
  .meta-item {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
  
  .pagination-container {
    flex-wrap: wrap;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.opportunity-card {
  animation: fadeIn 0.3s ease forwards;
  animation-delay: calc(0.1s * var(--index, 0));
  opacity: 0;
}

/* Button Styles */
.btn-primary {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  border-radius: 8px;
  transition: var(--transition);
}

.btn-primary:hover {
  background-color: #1e40af;
  border-color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-outline-primary {
  background-color: transparent;
  border-color: var(--primary);
  color: var(--primary);
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  border-radius: 8px;
  transition: var(--transition);
}

.btn-outline-primary:hover {
  background-color: var(--primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-outline-secondary {
  background-color: transparent;
  border-color: var(--secondary);
  color: var(--secondary);
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  border-radius: 8px;
  transition: var(--transition);
}

.btn-outline-secondary:hover {
  background-color: var(--secondary);
  color: white;
  transform: translateY(-2px);
}

/* Focus States */
.form-control:focus,
.form-select:focus,
.btn:focus {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  border-color: var(--primary);
  outline: none;
}

/* Custom Form Switch */
.form-check-input {
  width: 3em;
  height: 1.5em;
  margin-top: 0.25em;
  vertical-align: top;
  background-color: var(--light);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: none;
  appearance: none;
  transition: var(--transition);
}

.form-check-input:checked {
  background-color: var(--primary);
  border-color: var(--primary);
}

/* Additional Utility Classes */
.text-primary {
  color: var(--primary) !important;
}

.text-secondary {
  color: var(--secondary) !important;
}

.text-warning {
  color: var(--warning) !important;
}

.bg-primary-light {
  background-color: var(--primary-light) !important;
}

/* Print Styles */
@media print {
  .global-listings {
    background-color: white;
  }
  
  .hero-banner,
  .filters-panel,
  .pagination-container,
  .btn {
    display: none !important;
  }
  
  .opportunity-card {
    box-shadow: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }
}
  
        `}
        </style>
        </div>
  )
}

export default Offre;