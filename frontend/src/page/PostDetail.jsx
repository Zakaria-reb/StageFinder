import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaEuroSign,
  FaLaptopHouse,
  FaUser,
  FaEnvelope,
  FaChevronLeft,
  FaClock,
  FaCheck,
  FaTimes,
  FaGlobe,
  FaPencilAlt,
  FaTrashAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../layouts/UserNavbar';

const PostDetail = () => {
  // Récupérer l'ID du post depuis l'URL
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [isEtudiant, setIsEtudiant] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Charger les détails du post et les informations de l'utilisateur
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les détails du post
        const postResponse = await axios.get(`/api/posts/${id}`);
        setPost(postResponse.data.post);
        
        // Récupérer les informations de l'utilisateur connecté
        const userResponse = await axios.get('/api/user');
        setCurrentUser(userResponse.data);

        // Vérifier si l'utilisateur est le propriétaire du post
        if (userResponse.data && postResponse.data.post) {
          setIsPostOwner(userResponse.data.id === postResponse.data.post.user_id);
          setIsEtudiant(userResponse.data.type === 'etudiant');
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des données', err);
        setError('Failed to load opportunity details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Gérer la soumission de candidature
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    try {
      await axios.post('/api/applications', {
        post_id: id,
        message: applicationMessage
      });
      
      setShowApplicationForm(false);
      setSubmitSuccess('Your application has been submitted successfully!');
      setApplicationMessage('');
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Gérer la suppression d'un post
  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/posts/${id}`);
      navigate('/Offre', { state: { message: 'Post deleted successfully' } });
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete the post. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculer la durée du stage en semaines
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end - start;
    const durationDays = durationMs / (1000 * 60 * 60 * 24);
    const durationWeeks = Math.ceil(durationDays / 7);
    return durationWeeks;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-center">
              <Link to="/Offre" className="btn btn-outline-primary">
                <FaChevronLeft className="me-2" /> Back to opportunities
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <h3>Opportunity not found</h3>
          <p>The opportunity you're looking for doesn't exist or has been removed.</p>
          <Link to="/Offre" className="btn btn-primary mt-3">
            <FaChevronLeft className="me-2" /> Back to opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <Navbar />
      
      <div className="container mt-4 mb-5">
        <div className="row mb-4">
          <div className="col-6">
            <Link to="/Offre" className="btn btn-outline-secondary">
              <FaChevronLeft className="me-2" /> Back to opportunities
            </Link>
          </div>
          
          {/* Afficher les boutons de modification/suppression pour le propriétaire du post */}
          {isPostOwner && (
            <div className="col-6 text-end">
              <Link to={`/posts/edit/${id}`} className="btn btn-outline-primary me-2">
                <FaPencilAlt className="me-2" /> Edit
              </Link>
              
              <button 
                className="btn btn-outline-danger" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FaTrashAlt className="me-2" /> Delete
              </button>
            </div>
          )}
        </div>
        
        {/* Modale de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDeleteConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 text-warning">
                      <FaExclamationTriangle size={24} />
                    </div>
                    <div>
                      <p className="mb-0">Are you sure you want to delete this opportunity?</p>
                      <p className="text-danger mb-0"><strong>This action cannot be undone.</strong></p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={handleDeletePost}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      <>Delete</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {submitSuccess && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <FaCheck className="me-2" /> {submitSuccess}
            <button type="button" className="btn-close" onClick={() => setSubmitSuccess(null)}></button>
          </div>
        )}
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h1 className="post-title mb-2">{post.title}</h1>
                
                <div className="company-info d-flex align-items-center mb-3">
                  <div className="company-logo me-3">
                    <img 
                      src={post.user?.avatar || "/images/company-placeholder.jpg"} 
                      alt={post.user?.name} 
                      className="rounded-circle"
                      width="50"
                      height="50"
                    />
                  </div>
                  <div>
                    <div className="company-name fw-bold">{post.user?.name}</div>
                    <div className="text-muted small">
                      Posted on {new Date(post.created_at).toLocaleDateString('en-US')}
                    </div>
                  </div>
                </div>
                
                <div className="post-meta mb-4">
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div className="icon-container me-2">
                          <FaBriefcase className="text-primary" />
                        </div>
                        <div>
                          <div className="small text-muted">Field</div>
                          <div className="fw-medium">{post.domain}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div className="icon-container me-2">
                          <FaMapMarkerAlt className="text-primary" />
                        </div>
                        <div>
                          <div className="small text-muted">Location</div>
                          <div className="fw-medium">{post.ville} {post.teletravail && "(Remote available)"}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div className="icon-container me-2">
                          <FaCalendarAlt className="text-primary" />
                        </div>
                        <div>
                          <div className="small text-muted">Duration</div>
                          <div className="fw-medium">
                            {calculateDuration(post.date_debut, post.date_fin)} weeks
                            <span className="ms-1 text-muted small">
                              ({formatDate(post.date_debut)} - {formatDate(post.date_fin)})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div className="icon-container me-2">
                          <FaEuroSign className="text-primary" />
                        </div>
                        <div>
                          <div className="small text-muted">Compensation</div>
                          <div className="fw-medium">
                            {post.remunere ? 
                              (post.montant_remuneration ? `${post.montant_remuneration}€` : 'Paid') : 
                              'Unpaid'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="action-panel p-3 bg-light rounded">
                  {/* N'afficher le panneau de candidature que pour les utilisateurs de type "etudiant" et qui ne sont pas propriétaires du post */}
                  {isEtudiant && !isPostOwner ? (
                    <div>
                      {showApplicationForm ? (
                        <form onSubmit={handleSubmitApplication}>
                          <h5 className="mb-3">Apply for this opportunity</h5>
                          <div className="form-group mb-3">
                            <label htmlFor="applicationMessage" className="form-label">
                              Message (optional)
                            </label>
                            <textarea
                              id="applicationMessage"
                              className="form-control"
                              rows="4"
                              placeholder="Introduce yourself and explain why you're interested in this opportunity..."
                              value={applicationMessage}
                              onChange={(e) => setApplicationMessage(e.target.value)}
                            ></textarea>
                          </div>
                          
                          {submitError && (
                            <div className="alert alert-danger">
                              <FaTimes className="me-2" /> {submitError}
                            </div>
                          )}
                          
                          <div className="d-grid gap-2">
                            <button 
                              type="submit" 
                              className="btn btn-primary" 
                              disabled={submitting}
                            >
                              {submitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Submitting...
                                </>
                              ) : (
                                'Submit Application'
                              )}
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary"
                              onClick={() => setShowApplicationForm(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="text-center">
                          <p className="mb-3">Interested in this opportunity?</p>
                          <button 
                            className="btn btn-primary w-100" 
                            onClick={() => setShowApplicationForm(true)}
                          >
                            Apply Now
                          </button>
                        </div>
                      )}
                    </div>
                  ) : isPostOwner ? (
                    <div className="text-center">
                      <h5 className="mb-3">Manage Your Post</h5>
                      <Link to={`/applications/received/${id}`} className="btn btn-primary w-100 mb-2">
                        View Applications
                      </Link>
                      <div className="mt-3 text-muted">
                        <small>You are the owner of this opportunity posting</small>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="mb-2">Only students can apply to this opportunity</p>
                      <div className="mt-2 text-muted">
                        <small>You must be registered as a student to apply</small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Description</h5>
          </div>
          <div className="card-body">
            <div className="description-content">
              {post.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Required Skills</h5>
          </div>
          <div className="card-body">
            <div className="skills-container">
              {post.competences && post.competences.map((competence, index) => (
                <span key={index} className="skill-tag">
                  {competence}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">About {post.user?.name}</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-2 mb-3 mb-md-0">
                <img 
                  src={post.user?.avatar || "/images/company-placeholder.jpg"} 
                  alt={post.user?.name} 
                  className="img-fluid rounded"
                />
              </div>
              <div className="col-md-10">
                <h5>{post.user?.name}</h5>
                {post.user?.bio ? (
                  <p>{post.user?.bio}</p>
                ) : (
                  <p>No additional information available about this employer.</p>
                )}
                {post.user?.website && (
                  <div className="mb-2">
                    <FaGlobe className="me-2 text-secondary" />
                    <a href={post.user.website} target="_blank" rel="noopener noreferrer">
                      {post.user.website}
                    </a>
                  </div>
                )}
                <Link to={`/company/${post.user?.id}`} className="btn btn-outline-primary btn-sm mt-2">
                  View all opportunities from this employer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;