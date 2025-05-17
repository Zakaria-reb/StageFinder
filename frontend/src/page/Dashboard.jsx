import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../layouts/UserNavbar';

import { 
  FaChartLine, 
  FaUserTie, 
  FaBriefcase, 
  FaEnvelope, 
  FaBookmark, 
  FaUserEdit, 
  FaCog,
  FaPlus,
  FaBuilding,
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye,
  FaChevronRight
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer les données de l'utilisateur
        const userResponse = await axios.get('/api/user');
        setUser(userResponse.data);
        
        // Vérifier si userResponse.data a un type avant de continuer
        if (!userResponse.data || !userResponse.data.type) {
          console.error('Erreur: les données utilisateur sont incomplètes', userResponse.data);
          setError('Impossible de charger les données utilisateur');
          setLoading(false);
          return;
        }

        if (userResponse.data.type === 'entreprise') {
          // Pour les entreprises, récupérer leurs offres publiées
          const postsResponse = await axios.get('/api/my-posts');
          console.log('Posts response:', postsResponse.data);
          
          // Vérifier la structure de la réponse et adapter en conséquence
          if (postsResponse.data.posts) {
            setPosts(postsResponse.data.posts);
          } else if (Array.isArray(postsResponse.data)) {
            setPosts(postsResponse.data);
          } else {
            setPosts([]);
          }
          
          // Récupérer les candidatures reçues pour leurs offres
          const applicationsResponse = await axios.get('/api/received-applications');
          console.log('Applications response:', applicationsResponse.data);
          
          // Vérifier la structure de la réponse et adapter en conséquence
          if (applicationsResponse.data.applications) {
            setApplications(applicationsResponse.data.applications);
          } else if (Array.isArray(applicationsResponse.data)) {
            setApplications(applicationsResponse.data);
          } else {
            setApplications([]);
          }
        } else {
          // Pour les étudiants, récupérer les offres disponibles
          const postsResponse = await axios.get('/api/posts');
          console.log('Posts response:', postsResponse.data);
          
          // Vérifier la structure de la réponse et adapter en conséquence
          if (postsResponse.data.posts) {
            setPosts(postsResponse.data.posts);
          } else if (Array.isArray(postsResponse.data)) {
            setPosts(postsResponse.data);
          } else {
            setPosts([]);
          }
          
          // Récupérer leurs candidatures envoyées
          const myApplicationsResponse = await axios.get('/api/my-applications');
          console.log('My applications response:', myApplicationsResponse.data);
          
          // Vérifier la structure de la réponse et adapter en conséquence
          if (myApplicationsResponse.data.applications) {
            setApplications(myApplicationsResponse.data.applications);
          } else if (Array.isArray(myApplicationsResponse.data)) {
            setApplications(myApplicationsResponse.data);
          } else {
            setApplications([]);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
        setError(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="dashboard-container bg-light min-vh-100">
        <Navbar />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <div className="text-center">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loader pendant le chargement des données
  if (loading) {
    return (
      <div className="dashboard-container bg-light min-vh-100">
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container bg-light min-vh-100">
      <Navbar />

      <div className="container py-4">
        {/* En-tête du tableau de bord */}
        <div className="bg-white rounded p-4 mb-4 shadow-sm">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-1">Tableau de bord</h2>
              <p className="text-muted mb-0">
                Bienvenue, <strong>{user?.name}</strong>
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              {user?.type === 'entreprise' && (
                <Link to="/posts/new" className="btn btn-primary d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Publier une offre
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img 
                    src={user?.avatar || "/images/avatar-placeholder.jpg"} 
                    alt="Avatar" 
                    className="rounded-circle border mb-3" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  />
                  <h5 className="mb-0">{user?.name}</h5>
                  <p className="text-muted d-flex align-items-center justify-content-center">
                    {user?.type === 'entreprise' ? (
                      <><FaBuilding className="me-1" /> Entreprise</>
                    ) : (
                      <><FaGraduationCap className="me-1" /> Étudiant</>
                    )}
                  </p>
                </div>
                
                <div className="list-group list-group-flush nav-tabs border-0 mt-4">
                  <button 
                    className={`list-group-item list-group-item-action border-0 d-flex align-items-center ${activeTab === 'dashboard' ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <FaChartLine className="me-3" /> 
                    <span>Tableau de bord</span>
                  </button>
                  
                  <button 
                    className={`list-group-item list-group-item-action border-0 d-flex align-items-center ${activeTab === 'applications' ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('applications')}
                  >
                    <FaEnvelope className="me-3" /> 
                    <span>{user?.type === 'entreprise' ? 'Candidatures reçues' : 'Mes candidatures'}</span>
                  </button>
                  <Link 
                    to="/profil" 
                    className="list-group-item list-group-item-action border-0 d-flex align-items-center"
                  >
                    <FaUserEdit className="me-3" /> 
                    <span>Modifier le profil</span>
                  </Link>
                  <Link 
                    to="/parametres" 
                    className="list-group-item list-group-item-action border-0 d-flex align-items-center"
                  >
                    <FaCog className="me-3" /> 
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
                {/* Résumé */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">
                      {user?.type === 'entreprise' ? 'Résumé de vos activités' : 'Votre activité'}
                    </h5>
                  </div>
                  <div className="card-body">
                    {user?.type === 'entreprise' ? (
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="card-title">Offres publiées</h6>
                              <p className="card-text fs-4">{posts?.length || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="card-title">Candidatures reçues</h6>
                              <p className="card-text fs-4">{applications?.length || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="card border">
                            <div className="card-body">
                              <h6 className="card-title">Candidatures envoyées</h6>
                              <p className="card-text fs-4">{applications?.length || 0}</p>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenu récent */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      {user?.type === 'entreprise' ? 'Candidatures récentes' : 'Offres récentes'}
                    </h5>
                    <Link to={user?.type === 'entreprise' ? "/received-applications" : "/posts"} className="btn btn-sm btn-outline-primary">
                      Voir tout
                    </Link>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {user?.type === 'entreprise' ? (
  applications && applications.length > 0 ? (
    applications.slice(0, 5).map((application) => (
      <div key={application?.id || `app-${Math.random()}`} className="list-group-item p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">Candidature pour: {application?.post?.title || "Offre"}</h6>
            <p className="mb-1 text-muted small">Candidat: {application?.user?.name || "Candidat"}</p>
            <span className={`badge ${application?.status === 'pending' ? 'bg-warning' : application?.status === 'accepted' ? 'bg-success' : 'bg-danger'}`}>
              {application?.status === 'pending' ? 'En attente' : application?.status === 'accepted' ? 'Acceptée' : 'Refusée'}
            </span>
          </div>
          <div>
            <Link 
              to={`/applications/${application?.id}`} 
              className="btn btn-sm btn-outline-primary me-2"
            >
              <FaEye className="me-1" /> Détails
            </Link>
            <button 
              className="btn btn-sm btn-outline-success me-2"
              onClick={async () => {
                try {
                  await axios.put(`/api/applications/${application?.id}/status`, { status: 'accepted' });
                  // Rafraîchir les données
                  const response = await axios.get('/api/received-applications');
                  const updatedApplications = response.data.applications || response.data || [];
                  setApplications(updatedApplications);
                } catch (error) {
                  console.error('Erreur lors de la mise à jour du statut', error);
                  setError('Erreur lors de la mise à jour du statut');
                }
              }}
            >
              Accepter
            </button>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={async () => {
                try {
                  await axios.put(`/api/applications/${application?.id}/status`, { status: 'rejected' });
                  // Rafraîchir les données
                  const response = await axios.get('/api/received-applications');
                  const updatedApplications = response.data.applications || response.data || [];
                  setApplications(updatedApplications);
                } catch (error) {
                  console.error('Erreur lors de la mise à jour du statut', error);
                  setError('Erreur lors de la mise à jour du statut');
                }
              }}
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-4">
      <p className="mb-0">Aucune candidature reçue pour le moment.</p>
    </div>
  )
) : (
  // Le code pour les étudiants reste inchangé
  posts && posts.length > 0 ? (
    posts.slice(0, 5).map((post) => (
      <div key={post?.id || `post-${Math.random()}`} className="list-group-item p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">{post?.title || "Sans titre"}</h6>
            <p className="mb-1 text-muted small">Entreprise: {post?.user?.name || "Entreprise"}</p>
            <div className="d-flex flex-wrap align-items-center text-muted small">
              <span className="me-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-1" /> {post?.location || post?.ville || "Non spécifié"}
              </span>
              <span className="d-flex align-items-center">
                <FaCalendarAlt className="me-1" /> Posté le {post?.created_at ? new Date(post.created_at).toLocaleDateString() : "Date inconnue"}
              </span>
            </div>
          </div>
          <div>
            <Link to={`/PostDetail/${post?.id}`} className="btn btn-sm btn-outline-primary">
              <FaEye className="me-2" /> Voir
            </Link>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-4">
      <p className="mb-0">Aucune offre disponible pour le moment.</p>
    </div>
  )
)}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    {user?.type === 'entreprise' ? 'Mes offres de stage' : 'Offres disponibles'}
                  </h5>
                  {user?.type === 'entreprise' && (
                    <Link to="/posts/new" className="btn btn-primary d-inline-flex align-items-center">
                      <FaPlus className="me-2" /> Publier une offre
                    </Link>
                  )}
                </div>
                <div className="card-body p-0">
                  {posts && posts.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {posts.map((post) => (
                        <div key={post?.id || `post-${Math.random()}`} className="list-group-item p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-8">
                              <h6 className="mb-1">{post?.title || "Sans titre"}</h6>
                              <p className="text-muted small mb-2">{post?.description ? post.description.substring(0, 100) + '...' : ''}</p>
                              <div className="d-flex flex-wrap align-items-center text-muted small">
                                <span className="me-3 d-flex align-items-center">
                                  <FaCalendarAlt className="me-1" /> Posté le {post?.created_at ? new Date(post.created_at).toLocaleDateString() : "Date inconnue"}
                                </span>
                                <span className="me-3 d-flex align-items-center">
                                  <FaMapMarkerAlt className="me-1" /> {post?.location || post?.ville || "Non spécifié"}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4 mt-3 mt-md-0 text-md-end">
                              <div className="btn-group">
                                <Link to={`/posts/${post?.id}`} className="btn btn-sm btn-outline-primary">
                                  <FaEye className="me-2" /> Voir
                                </Link>
                                {user?.type === 'entreprise' && post?.user_id === user.id && (
                                  <>
                                    <Link to={`/posts/edit/${post?.id}`} className="btn btn-sm btn-outline-secondary">
                                      <FaUserEdit className="me-2" /> Modifier
                                    </Link>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={async () => {
                                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre?')) {
                                          try {
                                            await axios.delete(`/api/posts/${post?.id}`);
                                            // Retirer le post de la liste
                                            setPosts(posts.filter(p => p.id !== post?.id));
                                          } catch (error) {
                                            console.error('Erreur lors de la suppression', error);
                                            setError('Erreur lors de la suppression de l\'offre');
                                          }
                                        }
                                      }}
                                    >
                                      Supprimer
                                    </button>
                                  </>
                                )}
                                {user?.type === 'etudiant' && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={async () => {
                                      try {
                                        // Vérifier si l'utilisateur a déjà postulé
                                        const checkResponse = await axios.get(`/api/applications/check/${post?.id}`);
                                        if (checkResponse.data.hasApplied) {
                                          alert('Vous avez déjà postulé à cette offre.');
                                          return;
                                        }
                                        
                                        // Envoyer la candidature
                                        await axios.post('/api/applications', {
                                          post_id: post?.id,
                                          message: 'Je suis intéressé par cette offre.'
                                        });
                                        alert('Candidature envoyée avec succès!');
                                        
                                        // Rafraîchir les candidatures
                                        const appResponse = await axios.get('/api/my-applications');
                                        const updatedApplications = appResponse.data.applications || appResponse.data || [];
                                        setApplications(updatedApplications);
                                      } catch (error) {
                                        console.error('Erreur lors de la candidature', error);
                                        alert('Erreur lors de l\'envoi de la candidature.');
                                      }
                                    }}
                                  >
                                    Postuler
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <h5 className="mb-3">
                          {user?.type === 'entreprise' 
                            ? "Vous n'avez pas encore publié d'offre" 
                            : "Aucune offre disponible pour le moment"
                          }
                        </h5>
                        {user?.type === 'entreprise' && (
                          <Link to="/posts/new" className="btn btn-primary">
                            <FaPlus className="me-2" /> Publier votre première offre
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    {user?.type === 'entreprise' ? 'Candidatures reçues' : 'Mes candidatures'}
                  </h5>
                </div>
                <div className="card-body p-0">
                  {applications && applications.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {applications.map((application) => (
                        <div key={application?.id || `app-${Math.random()}`} className="list-group-item p-3 border-bottom">
                          <div className="row">
                            <div className="col-md-8">
                              <h6 className="mb-1">
                                {user?.type === 'entreprise' 
                                  ? `Candidature de ${application?.user?.name || "Candidat"}` 
                                  : `Candidature pour: ${application?.post?.title || "Offre"}`}
                              </h6>
                              <p className="text-muted small mb-2">
                                {user?.type === 'entreprise' 
                                  ? `Pour: ${application?.post?.title || "Offre"}` 
                                  : `Entreprise: ${application?.post?.user?.name || "Entreprise"}`}
                              </p>
                              {application?.message && (
                                <p className="mb-2 small">Message: {application.message}</p>
                              )}
                              <div className="d-flex flex-wrap align-items-center text-muted small">
                                <span className="me-3 d-flex align-items-center">
                                  <FaCalendarAlt className="me-1" /> Postulé le {application?.created_at ? new Date(application.created_at).toLocaleDateString() : "Date inconnue"}
                                </span>
                                <span className={`badge ${application?.status === 'pending' ? 'bg-warning' : application?.status === 'accepted' ? 'bg-success' : 'bg-danger'}`}>
                                  {application?.status === 'pending' ? 'En attente' : application?.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4 mt-3 mt-md-0 text-md-end">
                              {user?.type === 'entreprise' ? (
                                <div className="btn-group">
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={async () => {
                                      try {
                                        await axios.put(`/api/applications/${application?.id}/status`, { status: 'accepted' });
                                        // Rafraîchir les données
                                        const response = await axios.get('/api/received-applications');
                                        const updatedApplications = response.data.applications || response.data || [];
                                        setApplications(updatedApplications);
                                      } catch (error) {
                                        console.error('Erreur lors de la mise à jour du statut', error);
                                        setError('Erreur lors de la mise à jour du statut');
                                      }
                                    }}
                                  >
                                    Accepter
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={async () => {
                                      try {
                                        await axios.put(`/api/applications/${application?.id}/status`, { status: 'rejected' });
                                        // Rafraîchir les données
                                        const response = await axios.get('/api/received-applications');
                                        const updatedApplications = response.data.applications || response.data || [];
                                        setApplications(updatedApplications);
                                      } catch (error) {
                                        console.error('Erreur lors de la mise à jour du statut', error);
                                        setError('Erreur lors de la mise à jour du statut');
                                      }
                                    }}
                                  >
                                    Refuser
                                  </button>
                                </div>
                              ) : (
                                <Link to={`/posts/${application?.post_id}`} className="btn btn-sm btn-outline-primary">
                                  <FaEye className="me-2" /> Voir l'offre
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <h5 className="mb-3">
                          {user?.type === 'entreprise' 
                            ? "Vous n'avez pas encore reçu de candidatures" 
                            : "Vous n'avez pas encore postulé à des offres"
                          }
                        </h5>
                        {user?.type === 'etudiant' && (
                          <Link to="/posts" className="btn btn-primary">
                            Explorer les offres
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer simplifié */}
      
      {/* Footer simplifié */}
      
    </div>
  );
};

export default Dashboard;