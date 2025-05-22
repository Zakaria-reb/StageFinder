import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaEuroSign,
  FaUser,
  FaEnvelope,
  FaChevronLeft,
  FaClock,
  FaCheck,
  FaTimes,
  FaGraduationCap,
  FaPhone,
  FaBuilding,
  FaTrashAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../layouts/UserNavbar';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Récupérer les détails de la candidature
  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data) {
        throw new Error('Réponse vide du serveur');
      }
      
      setApplication(response.data);
    } catch (err) {
      let errorMessage = 'Erreur lors de la récupération des détails';
      
      if (err.response) {
        switch (err.response.status) {
          case 404:
            errorMessage = 'Candidature introuvable';
            break;
          case 403:
            errorMessage = 'Vous n\'êtes pas autorisé à voir cette candidature';
            break;
          case 500:
            errorMessage = 'Problème serveur - Veuillez réessayer plus tard';
            break;
          default:
            errorMessage = err.response.data.message || err.response.statusText;
        }
      } else {
        errorMessage = `Erreur réseau: ${err.message}`;
      }
      
      setError(errorMessage);
      console.error('Détails de l\'erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Changer le statut d'une candidature
  const updateApplicationStatus = async (status) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/applications/${id}/status`, 
        { status }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Mettre à jour l'application locale
      setApplication(prev => ({ ...prev, status }));
      
      alert(`La candidature a été ${status === 'accepted' ? 'acceptée' : 'rejetée'} avec succès.`);
    } catch (err) {
      let errorMessage = 'Erreur lors de la mise à jour du statut';
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour du statut:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Supprimer une candidature
  const deleteApplication = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      navigate('/received-applications', { 
        state: { message: 'La candidature a été supprimée avec succès' } 
      });
    } catch (err) {
      let errorMessage = 'Erreur lors de la suppression';
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error('Erreur lors de la suppression:', err);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FaCheckCircle className="text-success" />;
      case 'rejected':
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaHourglassHalf className="text-warning" />;
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  // Charger les détails au montage du composant
  useEffect(() => {
    if (id) {
      fetchApplicationDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Chargement des détails de la candidature...</p>
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
            <h4 className="alert-heading">Erreur!</h4>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-center gap-3">
              <button 
                onClick={() => navigate('/received-applications')}
                className="btn btn-outline-primary"
              >
                <FaChevronLeft className="me-2" /> Retour à la liste
              </button>
              <button 
                onClick={fetchApplicationDetails}
                className="btn btn-primary"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <h3>Candidature introuvable</h3>
          <p>La candidature que vous recherchez n'existe pas ou a été supprimée.</p>
          <button 
            onClick={() => navigate('/received-applications')}
            className="btn btn-primary mt-3"
          >
            <FaChevronLeft className="me-2" /> Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-details-page">
      <Navbar />
      
      <div className="container mt-4 mb-5">
        <div className="row mb-4">
          <div className="col-6">
            <button 
              onClick={() => navigate('/received-applications')}
              className="btn btn-outline-secondary"
            >
              <FaChevronLeft className="me-2" /> Retour à la liste
            </button>
          </div>
          
          <div className="col-6 text-end">
            <button 
              className="btn btn-outline-danger" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              <FaTrashAlt className="me-2" /> Supprimer
            </button>
          </div>
        </div>

        {/* Modale de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmer la suppression</h5>
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
                      <p className="mb-0">Êtes-vous sûr de vouloir supprimer cette candidature?</p>
                      <p className="text-danger mb-0"><strong>Cette action ne peut pas être annulée.</strong></p>
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
                    Annuler
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={deleteApplication}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        Suppression...
                      </>
                    ) : (
                      <>Supprimer</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* En-tête avec informations principales */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h1 className="mb-2">Candidature pour: {application.post?.title || 'Offre non disponible'}</h1>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    {getStatusIcon(application.status)}
                  </div>
                  <div>
                    <span className="fw-bold">Statut: </span>
                    <span className={`badge ${
                      application.status === 'accepted' ? 'bg-success' : 
                      application.status === 'rejected' ? 'bg-danger' : 'bg-warning'
                    }`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </div>

                <div className="text-muted small mb-3">
                  Candidature soumise le {formatDate(application.created_at)}
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="action-panel p-3 bg-light rounded">
                  <h5 className="mb-3">Actions</h5>
                  {application.status === 'pending' && (
                    <div className="d-grid gap-2 mb-3">
                      <button 
                        onClick={() => updateApplicationStatus('accepted')}
                        disabled={updating}
                        className="btn btn-success"
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-2" />
                            Accepter
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => updateApplicationStatus('rejected')}
                        disabled={updating}
                        className="btn btn-danger"
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <FaTimes className="me-2" />
                            Rejeter
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  {application.status !== 'pending' && (
                    <div className="text-center text-muted">
                      <small>Candidature déjà traitée</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations sur l'offre */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <FaBriefcase className="me-2 text-primary" />
              Informations sur l'offre
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="icon-container me-2">
                    <FaBriefcase className="text-primary" />
                  </div>
                  <div>
                    <div className="small text-muted">Domaine</div>
                    <div className="fw-medium">{application.post?.domain || 'Non spécifié'}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="icon-container me-2">
                    <FaMapMarkerAlt className="text-primary" />
                  </div>
                  <div>
                    <div className="small text-muted">Ville</div>
                    <div className="fw-medium">{application.post?.ville || 'Non spécifiée'}</div>
                  </div>
                </div>
              </div>

              {application.post?.date_debut && application.post?.date_fin && (
                <div className="col-md-12 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="icon-container me-2">
                      <FaCalendarAlt className="text-primary" />
                    </div>
                    <div>
                      <div className="small text-muted">Période</div>
                      <div className="fw-medium">
                        Du {formatDate(application.post.date_debut)} au {formatDate(application.post.date_fin)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informations sur le candidat */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <FaUser className="me-2 text-primary" />
              Informations sur le candidat
            </h5>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-2 mb-3 mb-md-0">
                <img 
                  src={application.user?.avatar || "/images/user-placeholder.jpg"} 
                  alt={application.user?.name} 
                  className="img-fluid rounded-circle"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-10">
                <h4>{application.user?.name || 'Non disponible'}</h4>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaEnvelope className="text-primary me-2" />
                      <span>{application.user?.email || 'Email non disponible'}</span>
                    </div>
                  </div>
                  {application.user?.telephone && (
                    <div className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <FaPhone className="text-primary me-2" />
                        <span>{application.user.telephone}</span>
                      </div>
                    </div>
                  )}
                  {application.user?.ville && (
                    <div className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="text-primary me-2" />
                        <span>{application.user.ville}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formation */}
            <div className="mb-4">
              <h5 className="mb-3">
                <FaGraduationCap className="me-2 text-primary" />
                Formation
              </h5>
              <div className="row">
                {application.user?.ecole && (
                  <div className="col-md-4 mb-2">
                    <div className="small text-muted">École</div>
                    <div className="fw-medium">{application.user.ecole}</div>
                  </div>
                )}
                {application.user?.niveau_etudes && (
                  <div className="col-md-4 mb-2">
                    <div className="small text-muted">Niveau d'études</div>
                    <div className="fw-medium">{application.user.niveau_etudes}</div>
                  </div>
                )}
                {application.user?.specialite && (
                  <div className="col-md-4 mb-2">
                    <div className="small text-muted">Spécialité</div>
                    <div className="fw-medium">{application.user.specialite}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Compétences */}
            {application.user?.competences && application.user.competences.length > 0 && (
              <div className="mb-4">
                <h5 className="mb-3">Compétences</h5>
                <div className="row">
                  {application.user.competences.map(comp => (
                    <div key={comp.id} className="col-md-6 mb-2">
                      <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                        <span className="fw-medium">{comp.nom}</span>
                        <span className="badge bg-primary">{comp.niveau}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expériences */}
            {application.user?.experiences && application.user.experiences.length > 0 && (
              <div className="mb-4">
                <h5 className="mb-3">
                  <FaBuilding className="me-2 text-primary" />
                  Expériences professionnelles
                </h5>
                {application.user.experiences.map(exp => (
                  <div key={exp.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{exp.poste}</h6>
                          <p className="text-muted mb-1">{exp.entreprise}</p>
                        </div>
                        <small className="text-muted">
                          {formatDate(exp.date_debut)} - {exp.date_fin ? formatDate(exp.date_fin) : 'Présent'}
                        </small>
                      </div>
                      {exp.description && (
                        <p className="mb-0">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formations */}
            {application.user?.formations && application.user.formations.length > 0 && (
              <div className="mb-4">
                <h5 className="mb-3">Formations</h5>
                {application.user.formations.map(form => (
                  <div key={form.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{form.diplome}</h6>
                          <p className="text-muted mb-1">{form.etablissement}</p>
                        </div>
                        <small className="text-muted">
                          {formatDate(form.date_debut)} - {form.date_fin ? formatDate(form.date_fin) : 'Présent'}
                        </small>
                      </div>
                      {form.description && (
                        <p className="mb-0">{form.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message de candidature */}
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">Message de candidature</h5>
          </div>
          <div className="card-body">
            {application.message ? (
              <div className="bg-light p-3 rounded">
                <p className="mb-0">{application.message}</p>
              </div>
            ) : (
              <p className="text-muted fst-italic">Aucun message fourni par le candidat.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;