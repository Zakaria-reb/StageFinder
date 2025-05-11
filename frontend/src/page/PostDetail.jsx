// src/page/PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaEuroSign, 
  FaLaptopHouse,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPaperPlane
} from 'react-icons/fa';
import { api, authService } from '../axiosConfig'; // Importer la configuration axios

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        try {
          // Récupérer les informations de l'utilisateur
          const userData = await authService.getUser();
          setUser(userData);
        } catch (err) {
          console.error('Erreur lors de la récupération des données utilisateur:', err);
        }
      }
    };

    checkAuth();
    
    if (id) {
      fetchPost();
      if (isAuthenticated) {
        checkApplicationStatus();
      }
    }
  }, [id, isAuthenticated]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/posts/${id}`);
      setPost(response.data.post);
      setError(null);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Impossible de récupérer cette offre de stage. Elle n\'existe peut-être plus.');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get(`/api/applications/check/${id}`);
      setApplicationSubmitted(response.data.hasApplied);
    } catch (err) {
      console.error('Error checking application status:', err);
      // Silently fail - we'll assume they haven't applied
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre de stage ?')) {
      return;
    }

    try {
      await api.delete(`/api/posts/${id}`);
      navigate('/my-posts');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Erreur lors de la suppression de l\'offre de stage.');
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/posts/${id}` } });
      return;
    }

    setApplicationLoading(true);
    try {
      await api.post(`/api/applications`, {
        post_id: id
      });
      setApplicationSubmitted(true);
      alert('Votre candidature a été envoyée avec succès !');
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.');
    } finally {
      setApplicationLoading(false);
    }
  };

  // Format date to French locale
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="post-detail py-5">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3 text-muted">Chargement de l'offre de stage...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail py-5">
        <div className="container">
          <div className="alert alert-danger rounded-4" role="alert">
            <h4 className="alert-heading">Erreur</h4>
            <p>{error}</p>
            <hr />
            <Link to="/posts" className="btn btn-outline-primary rounded-pill">
              <FaArrowLeft className="me-2" /> Retour à la liste des offres
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && post.user_id === user.id;
  const isStudent = user && user.type === 'etudiant';
  const canApply = isAuthenticated && isStudent && !isOwner && !applicationSubmitted;

  return (
    <div className="post-detail py-5">
      <div className="container">
        <div className="mb-4">
          <Link to="/posts" className="text-decoration-none text-primary">
            <FaArrowLeft className="me-2" /> Retour aux offres de stage
          </Link>
        </div>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-light border-0 py-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <h1 className="h2 fw-bold mb-2">{post.title}</h1>
              <div className="d-flex gap-2 mt-2 mt-md-0">
                {isOwner && (
                  <>
                    <Link
                      to={`/posts/edit/${post.id}`}
                      className="btn btn-primary rounded-pill"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="btn btn-outline-danger rounded-pill"
                    >
                      Supprimer
                    </button>
                  </>
                )}
                {canApply && (
                  <button
                    onClick={handleApply}
                    disabled={applicationLoading}
                    className="btn btn-success rounded-pill"
                  >
                    {applicationLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" /> Postuler
                      </>
                    )}
                  </button>
                )}
                {!isAuthenticated && (
                  <Link
                    to={`/login`}
                    state={{ from: `/posts/${id}` }}
                    className="btn btn-outline-primary rounded-pill"
                  >
                    <FaUser className="me-2" /> Se connecter pour postuler
                  </Link>
                )}
                {applicationSubmitted && (
                  <span className="badge bg-success py-2 px-3 rounded-pill d-flex align-items-center">
                    <FaPaperPlane className="me-2" /> Candidature envoyée
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                <FaBriefcase className="me-1 text-primary" /> {post.domain}
              </span>
              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                <FaMapMarkerAlt className="me-1 text-primary" /> {post.ville}
              </span>
              <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                <FaCalendarAlt className="me-1 text-primary" /> {post.type_stage}
              </span>
              {post.teletravail && (
                <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                  <FaLaptopHouse className="me-1 text-primary" /> Télétravail possible
                </span>
              )}
              {post.remunere && (
                <span className="badge bg-light text-dark rounded-pill d-flex align-items-center">
                  <FaEuroSign className="me-1 text-primary" /> 
                  {post.montant_remuneration ? `${post.montant_remuneration} €` : 'Rémunéré'}
                </span>
              )}
            </div>
          </div>

          <div className="card-body p-4">
            <div className="mb-4">
              <h2 className="h5 fw-bold">Informations sur le stage</h2>
              <div className="row mt-3">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="icon-circle bg-primary-light me-3">
                      <FaCalendarAlt className="text-primary" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Période</p>
                      <p className="fw-semibold mb-0">
                        Du {formatDate(post.date_debut)} au {formatDate(post.date_fin)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="icon-circle bg-primary-light me-3">
                      <FaUser className="text-primary" />
                    </div>
                    <div>
                      <p className="text-muted mb-0">Entreprise</p>
                      <p className="fw-semibold mb-0">{post.user?.name || 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="h5 fw-bold">Description</h2>
              <div className="mt-3 description-text">
                {post.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="h5 fw-bold">Compétences requises</h2>
              <div className="d-flex flex-wrap gap-2 mt-3">
                {post.competences && post.competences.map((skill, index) => (
                  <span key={index} className="badge bg-primary-light text-primary rounded-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-light rounded-4">
              <h2 className="h5 fw-bold">Contact</h2>
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="icon-circle bg-primary-light me-3">
                    <FaUser className="text-primary" />
                  </div>
                  <div>
                    <p className="mb-0"><strong>Entreprise :</strong> {post.user?.name || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-primary-light me-3">
                    <FaEnvelope className="text-primary" />
                  </div>
                  <div>
                    <p className="mb-0"><strong>Email :</strong> {post.user?.email || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS personnalisé */}
      <style jsx="true">{`
        /* Styles généraux */
        .post-detail {
          background-color: rgb(243, 246, 248);
        }

        /* Style des badges */
        .badge {
          font-weight: 500;
          padding: 0.5rem 0.75rem;
        }

        .badge.bg-primary-light {
          background-color: rgba(13, 110, 253, 0.1);
        }

        /* Style pour les icônes circulaires */
        .icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-primary-light {
          background-color: rgba(13, 110, 253, 0.1);
        }

        /* Style pour la description */
        .description-text {
          line-height: 1.6;
        }

        /* Responsive adjustments */
        @media (max-width: 767.98px) {
          .card-body {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PostDetail;