import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaChartLine, 
  FaUserTie, 
  FaBriefcase, 
  FaEnvelope, 
  FaBookmark, 
  FaUserEdit, 
  FaCog,
  FaPlus,
  FaFilter,
  FaBuilding,
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye,
  FaEnvelopeOpen,
  FaBell,
  FaSearch,
  FaChevronRight
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    applications: 0,
    views: 0,
    messages: 0,
    favorites: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/api/user');
        setUser(userResponse.data);

        const postsResponse = await axios.get('/api/posts');
        setPosts(postsResponse.data);

        // Simuler des statistiques
        setStats({
          applications: Math.floor(Math.random() * 20) + 5,
          views: Math.floor(Math.random() * 100) + 50,
          messages: Math.floor(Math.random() * 15) + 2,
          favorites: Math.floor(Math.random() * 10) + 1,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Loader pendant le chargement des données
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="dashboard-container bg-light min-vh-100">
      {/* Navbar améliorée */}
      <div className="container py-4">
        {/* En-tête du tableau de bord */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-1 fw-bold">Tableau de bord</h2>
              <p className="text-muted mb-0">
                Bienvenue, <strong>{user?.name}</strong>. Voici votre activité récente.
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              {user?.type === 'entreprise' ? (
                <Link to="/publier-offre" className="btn btn-primary btn-lg d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Publier une offre
                </Link>
              ) : (
                <Link to="/nouveau-post" className="btn btn-primary btn-lg d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Ajouter une disponibilité
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm mb-4 overflow-hidden">
              <div className="text-center p-4 bg-gradient-primary position-relative" style={{
                background: 'linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%)',
                height: '160px'
              }}>
                <div className="avatar-container position-absolute start-50 translate-middle-x" style={{bottom: '-40px'}}>
                  <img 
                    src={user?.avatar || "/images/avatar-placeholder.jpg"} 
                    alt="Avatar" 
                    className="rounded-circle border border-4 border-white shadow" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  />
                </div>
              </div>
              <div className="card-body pt-5 mt-3">
                <h5 className="text-center mb-1 fw-bold">{user?.name}</h5>
                <p className="text-center text-muted mb-3 d-flex align-items-center justify-content-center">
                  {user?.type === 'entreprise' ? (
                    <><FaBuilding className="me-1" /> Entreprise</>
                  ) : (
                    <><FaGraduationCap className="me-1" /> Étudiant</>
                  )}
                </p>
                
                {/* Complétion du profil */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Complétion du profil</span>
                    <span className="badge bg-primary rounded-pill">75%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ width: '75%', borderRadius: '4px' }} 
                      aria-valuenow="75" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <p className="text-muted small mt-2 mb-0">
                    Complétez votre profil pour augmenter vos chances d'être remarqué.
                  </p>
                </div>
                
                <div className="list-group list-group-flush nav-tabs border-0 mt-4">
                  <button 
                    className={`list-group-item list-group-item-action border-0 rounded d-flex align-items-center ${activeTab === 'dashboard' ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <FaChartLine className={`me-3 ${activeTab === 'dashboard' ? '' : 'text-primary'}`} /> 
                    <span>Tableau de bord</span>
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action border-0 rounded d-flex align-items-center ${activeTab === 'posts' ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('posts')}
                  >
                    <FaBriefcase className={`me-3 ${activeTab === 'posts' ? '' : 'text-primary'}`} /> 
                    <span>Mes publications</span>
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action border-0 rounded d-flex align-items-center ${activeTab === 'messages' ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('messages')}
                  >
                    <FaEnvelope className={`me-3 ${activeTab === 'messages' ? '' : 'text-primary'}`} /> 
                    <span>Messages</span>
                    {stats.messages > 0 && (
                      <span className={`badge rounded-pill ms-auto ${activeTab === 'messages' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                        {stats.messages}
                      </span>
                    )}
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action border-0 rounded d-flex align-items-center ${activeTab === 'favorites' ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    <FaBookmark className={`me-3 ${activeTab === 'favorites' ? '' : 'text-primary'}`} /> 
                    <span>{user?.type === 'entreprise' ? 'Candidats favoris' : 'Stages favoris'}</span>
                    {stats.favorites > 0 && (
                      <span className={`badge rounded-pill ms-auto ${activeTab === 'favorites' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                        {stats.favorites}
                      </span>
                    )}
                  </button>
                  <Link 
                    to="/profil" 
                    className="list-group-item list-group-item-action border-0 rounded d-flex align-items-center"
                  >
                    <FaUserEdit className="me-3 text-primary" /> 
                    <span>Modifier le profil</span>
                  </Link>
                  <Link 
                    to="/parametres" 
                    className="list-group-item list-group-item-action border-0 rounded d-flex align-items-center"
                  >
                    <FaCog className="me-3 text-primary" /> 
                    <span>Paramètres</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="col-lg-9">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                {/* Statistiques */}
                <div className="row g-3 mb-4">
                  <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm h-100 hover-shadow transition-all">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                              <FaBriefcase className="text-primary" />
                            </div>
                          </div>
                          <div>
                            <h6 className="text-muted small text-uppercase mb-1">Candidatures</h6>
                            <h3 className="mb-0 fw-bold">{stats.applications}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm h-100 hover-shadow transition-all">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                              <FaEye className="text-success" />
                            </div>
                          </div>
                          <div>
                            <h6 className="text-muted small text-uppercase mb-1">Vues</h6>
                            <h3 className="mb-0 fw-bold">{stats.views}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm h-100 hover-shadow transition-all">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                              <FaEnvelopeOpen className="text-info" />
                            </div>
                          </div>
                          <div>
                            <h6 className="text-muted small text-uppercase mb-1">Messages</h6>
                            <h3 className="mb-0 fw-bold">{stats.messages}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm h-100 hover-shadow transition-all">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                              <FaBookmark className="text-warning" />
                            </div>
                          </div>
                          <div>
                            <h6 className="text-muted small text-uppercase mb-1">Favoris</h6>
                            <h3 className="mb-0 fw-bold">{stats.favorites}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liste des posts récents */}
                <div className="card border-0 shadow-sm mb-4 rounded-3 overflow-hidden">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                      {user?.type === 'entreprise' ? 'Candidats disponibles' : 'Offres de stage récentes'}
                    </h5>
                    <div className="d-flex align-items-center">
                      <div className="dropdown me-2">
                        <button className="btn btn-sm btn-light d-flex align-items-center" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                          <FaFilter className="me-1" /> Filtrer
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="filterDropdown">
                          <li><a className="dropdown-item" href="#">Tous les domaines</a></li>
                          <li><a className="dropdown-item" href="#">Informatique</a></li>
                          <li><a className="dropdown-item" href="#">Marketing</a></li>
                          <li><a className="dropdown-item" href="#">Finance</a></li>
                          <li><a className="dropdown-item" href="#">Logistique</a></li>
                        </ul>
                      </div>
                      <Link to="/offres" className="btn btn-sm btn-outline-primary">
                        Voir tout
                      </Link>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {posts.length > 0 ? (
                        posts.slice(0, 5).map((post, index) => (
                          <div key={post.id} className="list-group-item p-3 border-0 border-bottom transition-all hover-bg-light">
                            <div className="row align-items-center">
                              <div className="col-md-8">
                                <div className="d-flex align-items-center">
                                  <div className="flex-shrink-0">
                                    <img 
                                      src={post.user.avatar || "/images/avatar-placeholder.jpg"} 
                                      alt={post.user.name} 
                                      className={`rounded-${post.user.type === 'entreprise' ? '3' : 'circle'} me-3 shadow-sm border`}
                                      style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                    />
                                  </div>
                                  <div>
                                    <h6 className="mb-1 fw-bold">
                                      <Link to={`/posts/${post.id}`} className="text-decoration-none text-dark stretched-link">
                                        {post.title}
                                      </Link>
                                    </h6>
                                    <div className="d-flex flex-wrap align-items-center text-muted small">
                                      <span className="me-3 d-flex align-items-center">
                                        {post.user.type === 'entreprise' ? (
                                          <><FaBuilding className="me-1" /> {post.user.name}</>
                                        ) : (
                                          <><FaGraduationCap className="me-1" /> {post.user.name}</>
                                        )}
                                      </span>
                                      <span className="me-3 d-flex align-items-center">
                                        <FaMapMarkerAlt className="me-1" /> {post.location || "Casablanca"}
                                      </span>
                                      <span className="d-flex align-items-center">
                                        <FaCalendarAlt className="me-1" /> Posté le {new Date(post.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 mt-2 mt-md-0 text-md-end">
                                <span className="badge bg-primary bg-opacity-10 text-primary me-2 px-3 py-2 rounded-pill">{post.domain}</span>
                                <span className="badge bg-light text-dark px-3 py-2 rounded-pill">{post.type || "Temps plein"}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-5">
                          <div className="mb-3">
                            <div className="bg-light rounded-circle p-4 d-inline-block mb-2">
                              <FaBriefcase className="text-muted" size={32} />
                            </div>
                            <p className="text-muted mb-3">Aucun post disponible pour le moment.</p>
                            <Link to="/explorer" className="btn btn-primary">
                              Explorer les opportunités
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {posts.length > 0 && (
                    <div className="card-footer bg-white text-center py-3 border-0">
                      <Link to="/offres" className="text-decoration-none text-primary d-inline-flex align-items-center">
                        Voir toutes les offres <FaChevronRight className="ms-2" size={12} />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Messages récents */}
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                  <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Messages récents</h5>
                    <Link to="/messages" className="btn btn-sm btn-outline-primary">
                      Voir tout
                    </Link>
                  </div>
                  <div className="card-body p-0">
                    {stats.messages > 0 ? (
                      <div className="list-group list-group-flush">
                        {[...Array(3)].map((_, index) => (
                          <Link key={index} to="/messages" className="list-group-item list-group-item-action p-3 border-0 border-bottom transition-all">
                            <div className="d-flex w-100 justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div className="position-relative me-3">
                                  <img 
                                    src={`/images/avatar-${index + 1}.jpg`} 
                                    alt="Avatar" 
                                    className="rounded-circle border" 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                  />
                                  <span className={`position-absolute bottom-0 end-0 p-1 bg-${index === 0 ? 'success' : 'secondary'} rounded-circle border border-white`} style={{width: '14px', height: '14px'}}></span>
                                </div>
                                <div>
                                  <h6 className="mb-1 fw-bold">
                                    {user?.type === 'entreprise' ? `Étudiant ${index + 1}` : `Recruteur ${index + 1}`}
                                    {index === 0 && <span className="badge bg-danger ms-2">Nouveau</span>}
                                  </h6>
                                  <p className="mb-0 text-muted small">Bonjour, je suis intéressé par votre offre...</p>
                                </div>
                              </div>
                              <div className="text-end">
                                <small className="text-muted d-block">{index === 0 ? "Aujourd'hui" : `Il y a ${index + 1} jours`}</small>
                                {index === 0 && <span className="badge rounded-pill bg-primary">1</span>}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <div className="mb-3">
                          <div className="bg-light rounded-circle p-4 d-inline-block mb-2">
                            <FaEnvelope className="text-muted" size={32} />
                          </div>
                          <p className="text-muted mb-3">Aucun message pour le moment.</p>
                          <Link to="/explorer" className="btn btn-primary">
                            Explorer les opportunités
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  {stats.messages > 0 && (
                    <div className="card-footer bg-white text-center py-3 border-0">
                      <Link to="/messages" className="text-decoration-none text-primary d-inline-flex align-items-center">
                        Voir tous les messages <FaChevronRight className="ms-2" size={12} />
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Mes publications</h5>
                  {user?.type === 'entreprise' ? (
                    <Link to="/publier-offre" className="btn btn-primary d-inline-flex align-items-center">
                      <FaPlus className="me-2" /> Publier une offre
                    </Link>
                  ) : (
                    <Link to="/nouveau-post" className="btn btn-primary d-inline-flex align-items-center">
                      <FaPlus className="me-2" /> Ajouter une disponibilité
                    </Link>
                  )}
                </div>
                <div className="card-body p-0">
                  {posts.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {posts.map((post) => (
                        <div key={post.id} className="list-group-item p-3 border-0 border-bottom transition-all hover-bg-light">
                          <div className="row">
                            <div className="col-md-8">
                              <h6 className="mb-1 fw-bold">{post.title}</h6>
                              <p className="text-muted small mb-2">{post.description.substring(0, 100)}...</p>
                              <div className="d-flex flex-wrap align-items-center text-muted small">
                                <span className="me-3 d-flex align-items-center">
                                  <FaCalendarAlt className="me-1" /> Posté le {new Date(post.created_at).toLocaleDateString()}
                                </span>
                                <span className="badge bg-primary bg-opacity-10 text-primary me-2 rounded-pill">{post.domain}</span>
                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill">
                                  <FaEye className="me-1" /> {Math.floor(Math.random() * 50) + 10} vues
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4 mt-3 mt-md-0 text-md-end">
                              <div className="btn-group">
                                <Link to={`/posts/${post.id}`} className="btn btn-sm btn-outline-primary">
                                  <FaEye className="me-2" /> Voir
                                </Link>
                                <Link to={`/edit-post/${post.id}`} className="btn btn-sm btn-outline-secondary">
                                  <FaUserEdit className="me-2" /> Modifier
                                </Link>
                                <button className="btn btn-sm btn-outline-danger">
                                  <span className="d-none d-md-inline me-2">Supprimer</span> <span className="d-inline d-md-none">×</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
                          <FaBriefcase className="text-muted" size={32} />
                        </div>
                        <h5 className="mb-3">Vous n'avez pas encore publié de contenu</h5>
                        <p className="text-muted mb-4">Commencez à partager vos opportunités avec la communauté.</p>
                        {user?.type === 'entreprise' ? (
                          <Link to="/publier-offre" className="btn btn-primary btn-lg">
                            <FaPlus className="me-2" /> Publier votre première offre
                          </Link>
                        ) : (
                          <Link to="/nouveau-post" className="btn btn-primary btn-lg">
                            <FaPlus className="me-2" /> Ajouter votre première disponibilité
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Messages</h5>
                  <div className="input-group" style={{maxWidth: "250px"}}>
                    <input type="text" className="form-control form-control-sm" placeholder="Rechercher..." />
                    <button className="btn btn-outline-secondary btn-sm" type="button">
                      <FaSearch />
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  {stats.messages > 0 ? (
                    <div className="list-group list-group-flush">
                      {[...Array(5)].map((_, index) => (
                        <Link key={index} to="/messages" className="list-group-item list-group-item-action p-3 border-0 border-bottom transition-all hover-bg-light">
                          <div className="d-flex w-100 justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <img 
                                  src={`/images/avatar-${index + 1}.jpg`} 
                                  alt="Avatar" 
                                  className="rounded-circle border" 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                />
                                <span className={`position-absolute bottom-0 end-0 p-1 bg-${index < 2 ? 'success' : 'secondary'} rounded-circle border border-white`} style={{width: '14px', height: '14px'}}></span>
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">
                                  {user?.type === 'entreprise' ? `Étudiant ${index + 1}` : `Recruteur ${index + 1}`}
                                  {index === 0 && <span className="badge bg-danger ms-2">Nouveau</span>}
                                </h6>
                                <p className="mb-0 text-muted small">{index % 2 === 0 ? "Bonjour, je suis intéressé par votre offre de stage..." : "Merci pour votre réponse. Serait-il possible de planifier un entretien?"}</p>
                              </div>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">{index === 0 ? "Aujourd'hui" : index === 1 ? "Hier" : `Il y a ${index} jours`}</small>
                              {index < 2 && <span className="badge rounded-pill bg-primary">{index === 0 ? 2 : 1}</span>}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
                          <FaEnvelope className="text-muted" size={32} />
                        </div>
                        <h5 className="mb-3">Votre boîte de réception est vide</h5>
                        <p className="text-muted mb-4">Vous n'avez pas encore de messages. Commencez à interagir avec la communauté.</p>
                        <Link to="/explorer" className="btn btn-primary btn-lg">
                          Explorer les opportunités
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    {user?.type === 'entreprise' ? 'Candidats favoris' : 'Stages favoris'}
                  </h5>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      Trier par
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="sortDropdown">
                      <li><a className="dropdown-item" href="#">Les plus récents</a></li>
                      <li><a className="dropdown-item" href="#">Les plus pertinents</a></li>
                      <li><a className="dropdown-item" href="#">Par domaine</a></li>
                    </ul>
                  </div>
                </div>
                <div className="card-body p-0">
                  {stats.favorites > 0 ? (
                    <div className="list-group list-group-flush">
                      {[...Array(stats.favorites)].map((_, index) => (
                        <div key={index} className="list-group-item p-3 border-0 border-bottom transition-all hover-bg-light">
                          <div className="row align-items-center">
                            <div className="col-md-2 col-lg-1 mb-3 mb-md-0">
                              <img 
                                src={user?.type === 'entreprise' ? `/images/students/student-${index + 1}.jpg` : `/images/companies/company-${index + 1}.png`}
                                alt="Avatar" 
                                className={`${user?.type === 'entreprise' ? 'rounded-circle' : 'rounded-3'} border shadow-sm`}
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                              />
                            </div>
                            <div className="col-md-7 col-lg-8 mb-3 mb-md-0">
                              <h6 className="mb-1 fw-bold">
                                {user?.type === 'entreprise' 
                                  ? `Étudiant en ${['Informatique', 'Marketing', 'Finance', 'Ingénierie'][index % 4]}`
                                  : `Stage ${['Marketing Digital', 'Développement Web', 'Comptabilité', 'Design UX/UI'][index % 4]}`
                                }
                              </h6>
                              <div className="d-flex flex-wrap align-items-center text-muted small mb-2">
                                <span className="me-3 d-flex align-items-center">
                                  {user?.type === 'entreprise' 
                                    ? <><FaGraduationCap className="me-1" /> Université de Casablanca</>
                                    : <><FaBuilding className="me-1" /> Entreprise ACME</>
                                  }
                                </span>
                                <span className="me-3 d-flex align-items-center">
                                  <FaMapMarkerAlt className="me-1" /> Casablanca
                                </span>
                              </div>
                              <div className="d-flex flex-wrap">
                                <span className="badge bg-primary bg-opacity-10 text-primary me-2 mb-1">
                                  {['Informatique', 'Marketing', 'Finance', 'Logistique'][index % 4]}
                                </span>
                                <span className="badge bg-success bg-opacity-10 text-success me-2 mb-1">
                                  {['Temps plein', 'Temps partiel', 'Alternance', 'Remote'][index % 4]}
                                </span>
                                <span className="badge bg-info bg-opacity-10 text-info me-2 mb-1">
                                  {['3 mois', '6 mois', '4 mois', '2 mois'][index % 4]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-3 text-md-end">
                              <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                                <Link to={`/profil/${index}`} className="btn btn-sm btn-outline-primary">
                                  <FaEye className="me-md-2" /> <span className="d-none d-md-inline">Voir</span>
                                </Link>
                                <Link to={`/messages/new/${index}`} className="btn btn-sm btn-outline-info">
                                  <FaEnvelope className="me-md-2" /> <span className="d-none d-md-inline">Message</span>
                                </Link>
                                <button className="btn btn-sm btn-outline-danger">
                                  <FaBookmark className="me-md-2" /> <span className="d-none d-md-inline">Retirer</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
                          <FaBookmark className="text-muted" size={32} />
                        </div>
                        <h5 className="mb-3">Aucun favori pour le moment</h5>
                        <p className="text-muted mb-4">
                          {user?.type === 'entreprise' 
                            ? "Enregistrez les profils des candidats qui vous intéressent pour les retrouver facilement."
                            : "Enregistrez les offres de stage qui vous intéressent pour les retrouver facilement."
                          }
                        </p>
                        <Link to="/explorer" className="btn btn-primary btn-lg">
                          Explorer les opportunités
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white mt-auto border-top py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 text-muted">&copy; 2025 StageConnect. Tous droits réservés.</p>
            </div>
            <div className="col-md-6">
              <ul className="list-inline mb-0 text-center text-md-end">
                <li className="list-inline-item">
                  <a href="#" className="text-muted text-decoration-none">Confidentialité</a>
                </li>
                <li className="list-inline-item ms-3">
                  <a href="#" className="text-muted text-decoration-none">Conditions</a>
                </li>
                <li className="list-inline-item ms-3">
                  <a href="#" className="text-muted text-decoration-none">Aide</a>
                </li>
                <li className="list-inline-item ms-3">
                  <a href="#" className="text-muted text-decoration-none">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Composant de squelette pendant le chargement
const DashboardSkeleton = () => {
  return (
    <div className="dashboard-container bg-light min-vh-100">
      <div className="container py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="skeleton-loader h4 w-25"></div>
              <div className="skeleton-loader w-50 mt-2"></div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="skeleton-loader btn-lg w-75 ms-auto"></div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-0">
                <div className="text-center p-4 bg-gradient-primary text-white rounded-top">
                  <div className="skeleton-loader rounded-circle mx-auto mb-3" style={{width: "100px", height: "100px"}}></div>
                  <div className="skeleton-loader h5 w-50 mx-auto"></div>
                  <div className="skeleton-loader w-75 mx-auto mt-2"></div>
                </div>
                <div className="list-group list-group-flush p-2">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="skeleton-loader w-100 my-2 p-3"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="row g-3 mb-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="col-md-3 col-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="skeleton-loader rounded-circle me-3" style={{width: "50px", height: "50px"}}></div>
                        <div className="w-100">
                          <div className="skeleton-loader w-75 mb-2"></div>
                          <div className="skeleton-loader h4 w-25"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="skeleton-loader h5 w-25"></div>
                  <div className="skeleton-loader w-25"></div>
                </div>
              </div>
              <div className="card-body p-0">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="list-group-item p-3">
                    <div className="d-flex">
                      <div className="skeleton-loader rounded-circle me-3" style={{width: "50px", height: "50px"}}></div>
                      <div className="w-100">
                        <div className="skeleton-loader w-75 mb-2"></div>
                        <div className="skeleton-loader w-50 mb-2"></div>
                        <div className="d-flex">
                          <div className="skeleton-loader w-25 me-2"></div>
                          <div className="skeleton-loader w-25"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles CSS supplémentaires à ajouter à votre fichier CSS global
const globalStyles = `
/* Styles supplémentaires pour le dashboard */
.bg-primary-soft {
  background-color: rgba(74, 108, 247, 0.1);
}

.bg-success-soft {
  background-color: rgba(25, 185, 125, 0.1);
}

.bg-info-soft {
  background-color: rgba(17, 141, 240, 0.1);
}

.bg-warning-soft {
  background-color: rgba(255, 171, 0, 0.1);
}

.bg-danger-soft {
  background-color: rgba(234, 84, 85, 0.1);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%);
}

.hover-shadow:hover {
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
}

.hover-bg-light:hover {
  background-color: rgba(0, 0, 0, 0.01) !important;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Animation pour les éléments du tableau de bord */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-container .card,
.dashboard-container .list-group-item {
  animation: fadeInUp 0.4s ease-out forwards;
}

/* Décalage de l'animation pour les éléments statistiques */
.dashboard-container .row.g-3 .col-md-3:nth-child(1) .card {
  animation-delay: 0.1s;
}
.dashboard-container .row.g-3 .col-md-3:nth-child(2) .card {
  animation-delay: 0.2s;
}
.dashboard-container .row.g-3 .col-md-3:nth-child(3) .card {
  animation-delay: 0.3s;
}
.dashboard-container .row.g-3 .col-md-3:nth-child(4) .card {
  animation-delay: 0.4s;
}

/* Effet de survol sur les boutons */
.btn-primary {
  background-color: #4a6cf7;
  border-color: #4a6cf7;
  box-shadow: 0 0.125rem 0.25rem rgba(74, 108, 247, 0.15);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #2b50e0;
  border-color: #2b50e0;
  transform: translateY(-1px);
  box-shadow: 0 0.5rem 1rem rgba(74, 108, 247, 0.2);
}

/* Loaders pour le skeleton */
.skeleton-loader {
  display: block;
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 0.25rem;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-loader.h4 {
  height: 1.5rem;
}

.skeleton-loader.h5 {
  height: 1.25rem;
}

.smaller {
  font-size: 0.75rem;
}

/* Style d'onglet actif */
.list-group-item.active {
  border-radius: 6px;
  font-weight: 600;
}

/* Ajouts des média queries pour responsive */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.25rem !important;
  }
  
  .badge {
    font-size: 0.65rem;
  }
}
`;

export default Dashboard;