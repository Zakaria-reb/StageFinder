import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
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
import Navbar from '../layouts/UserNavbar';

const Application = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

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

  // Récupérer toutes les candidatures reçues
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/received-applications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setApplications(response.data);
      setError(null);
    } catch (err) {
      let errorMessage = 'Erreur lors de la récupération des candidatures';
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Vous devez être connecté pour voir les candidatures';
            break;
          case 403:
            errorMessage = 'Vous n\'avez pas les droits pour voir ces candidatures';
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
      console.error('Erreur lors de la récupération des candidatures:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les détails d'une candidature
  const fetchApplicationDetails = async (id) => {
    setDetailsLoading(true);
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
      
      setSelectedApplication(response.data);
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
      
      // Réinitialiser la sélection en cas d'erreur
      setSelectedApplication(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Changer le statut d'une candidature
  const updateApplicationStatus = async (id, status) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/applications/${id}/status`, 
        { status }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Mettre à jour la liste des candidatures
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      
      // Si nous sommes en train de voir les détails de cette candidature, mettre à jour les détails aussi
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication({ ...selectedApplication, status });
      }
      
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
  const deleteApplication = async (id) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Mettre à jour la liste des candidatures
      setApplications(applications.filter(app => app.id !== id));
      
      // Si nous sommes en train de voir les détails de cette candidature, fermer les détails
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication(null);
      }
      
      alert('La candidature a été supprimée avec succès.');
    } catch (err) {
      let errorMessage = 'Erreur lors de la suppression';
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error('Erreur lors de la suppression:', err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Fermer le panneau de détails
  const closeDetails = () => {
    setSelectedApplication(null);
  };

  // Charger les candidatures au chargement du composant
  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="received-applications-page">
      <Navbar />
      
      <div className="container mt-4 mb-5">
        <h1 className="mb-4">Candidatures reçues</h1>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Erreur!</h4>
            <p>{error}</p>
            <hr />
            <button 
              onClick={() => setError(null)}
              className="btn btn-outline-primary"
            >
              Fermer
            </button>
          </div>
        )}
        
        {/* Panneau principal - Liste des candidatures */}
        <div className="applications-list">
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Chargement des candidatures...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <h4>Aucune candidature reçue pour le moment</h4>
                <p className="text-muted">Vous verrez apparaître ici les candidatures que vous recevez</p>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Candidat</th>
                        <th>Offre</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app.id} className={`status-${app.status}`}>
                          <td>{app.user?.name || 'Non disponible'}</td>
                          <td>{app.post?.title || 'Offre non disponible'}</td>
                          <td>{formatDate(app.created_at)}</td>
                          <td>
                            <span className={`badge ${
                              app.status === 'accepted' ? 'bg-success' : 
                              app.status === 'rejected' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {getStatusText(app.status)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                onClick={() => fetchApplicationDetails(app.id)}
                                className="btn btn-sm btn-outline-primary"
                              >
                                Détails
                              </button>
                              {app.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                    disabled={updating}
                                    className="btn btn-sm btn-success"
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
                                    onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                    disabled={updating}
                                    className="btn btn-sm btn-danger"
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
                                </>
                              )}
                              <button 
                                onClick={() => setShowDeleteConfirm(app.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
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
                    onClick={() => {
                      deleteApplication(showDeleteConfirm);
                      setShowDeleteConfirm(false);
                    }}
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

        {/* Panneau de détails - S'affiche seulement quand une candidature est sélectionnée */}
        {selectedApplication && (
          <div className="application-details mt-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0">Détails de la candidature</h2>
                  <button 
                    onClick={closeDetails}
                    className="btn btn-outline-secondary"
                  >
                    Fermer
                  </button>
                </div>
              </div>
              
              {detailsLoading ? (
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Chargement des détails...</p>
                </div>
              ) : (
                <div className="card-body">
                  <div className="details-content">
                    <div className="row mb-4">
                      <div className="col-md-8">
                        <h3>Candidature pour: {selectedApplication.post?.title || 'Offre non disponible'}</h3>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3">
                            {getStatusIcon(selectedApplication.status)}
                          </div>
                          <div>
                            <span className="fw-bold">Statut: </span>
                            <span className={`badge ${
                              selectedApplication.status === 'accepted' ? 'bg-success' : 
                              selectedApplication.status === 'rejected' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {getStatusText(selectedApplication.status)}
                            </span>
                          </div>
                        </div>

                        <div className="text-muted small mb-3">
                          Candidature soumise le {formatDate(selectedApplication.created_at)}
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="action-panel p-3 bg-light rounded">
                          <h5 className="mb-3">Actions</h5>
                          {selectedApplication.status === 'pending' && (
                            <div className="d-grid gap-2 mb-3">
                              <button 
                                onClick={() => updateApplicationStatus(selectedApplication.id, 'accepted')}
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
                                onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
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
                          {selectedApplication.status !== 'pending' && (
                            <div className="text-center text-muted">
                              <small>Candidature déjà traitée</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
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
                                    <div className="fw-medium">{selectedApplication.post?.domain || 'Non spécifié'}</div>
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
                                    <div className="fw-medium">{selectedApplication.post?.ville || 'Non spécifiée'}</div>
                                  </div>
                                </div>
                              </div>

                              {selectedApplication.post?.date_debut && selectedApplication.post?.date_fin && (
                                <div className="col-md-12 mb-3">
                                  <div className="d-flex align-items-center">
                                    <div className="icon-container me-2">
                                      <FaCalendarAlt className="text-primary" />
                                    </div>
                                    <div>
                                      <div className="small text-muted">Période</div>
                                      <div className="fw-medium">
                                        Du {formatDate(selectedApplication.post.date_debut)} au {formatDate(selectedApplication.post.date_fin)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        {/* Informations sur le candidat */}
                        <div className="card shadow-sm mb-4">
                          <div className="card-header bg-white">
                            <h5 className="mb-0">
                              <FaUser className="me-2 text-primary" />
                              Informations sur le candidat
                            </h5>
                          </div>
                          <div className="card-body">
                            <div className="row mb-3">
                              <div className="col-md-3 mb-3 mb-md-0">
                                <img 
                                  src={selectedApplication.user?.avatar || "/images/user-placeholder.jpg"} 
                                  alt={selectedApplication.user?.name} 
                                  className="img-fluid rounded-circle"
                                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                />
                              </div>
                              <div className="col-md-9">
                                <h5>{selectedApplication.user?.name || 'Non disponible'}</h5>
                                <div className="row">
                                  <div className="col-md-12 mb-2">
                                    <div className="d-flex align-items-center">
                                      <FaEnvelope className="text-primary me-2" />
                                      <span>{selectedApplication.user?.email || 'Email non disponible'}</span>
                                    </div>
                                  </div>
                                  {selectedApplication.user?.telephone && (
                                    <div className="col-md-12 mb-2">
                                      <div className="d-flex align-items-center">
                                        <FaPhone className="text-primary me-2" />
                                        <span>{selectedApplication.user.telephone}</span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedApplication.user?.ville && (
                                    <div className="col-md-12 mb-2">
                                      <div className="d-flex align-items-center">
                                        <FaMapMarkerAlt className="text-primary me-2" />
                                        <span>{selectedApplication.user.ville}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Formation */}
                            <div className="mb-3">
                              <h6 className="mb-2">
                                <FaGraduationCap className="me-2 text-primary" />
                                Formation
                              </h6>
                              <div className="row">
                                {selectedApplication.user?.ecole && (
                                  <div className="col-md-6 mb-2">
                                    <div className="small text-muted">École</div>
                                    <div className="fw-medium">{selectedApplication.user.ecole}</div>
                                  </div>
                                )}
                                {selectedApplication.user?.niveau_etudes && (
                                  <div className="col-md-6 mb-2">
                                    <div className="small text-muted">Niveau d'études</div>
                                    <div className="fw-medium">{selectedApplication.user.niveau_etudes}</div>
                                  </div>
                                )}
                                {selectedApplication.user?.specialite && (
                                  <div className="col-md-12 mb-2">
                                    <div className="small text-muted">Spécialité</div>
                                    <div className="fw-medium">{selectedApplication.user.specialite}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compétences */}
                    {selectedApplication.user?.competences && selectedApplication.user.competences.length > 0 && (
                      <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white">
                          <h5 className="mb-0">Compétences</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {selectedApplication.user.competences.map(comp => (
                              <div key={comp.id} className="col-md-6 mb-2">
                                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                  <span className="fw-medium">{comp.nom}</span>
                                  <span className="badge bg-primary">{comp.niveau}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expériences */}
                    {selectedApplication.user?.experiences && selectedApplication.user.experiences.length > 0 && (
                      <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white">
                          <h5 className="mb-0">
                            <FaBuilding className="me-2 text-primary" />
                            Expériences professionnelles
                          </h5>
                        </div>
                        <div className="card-body">
                          {selectedApplication.user.experiences.map(exp => (
                            <div key={exp.id} className="mb-3">
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
                              <hr className="my-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formations */}
                    {selectedApplication.user?.formations && selectedApplication.user.formations.length > 0 && (
                      <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white">
                          <h5 className="mb-0">Formations</h5>
                        </div>
                        <div className="card-body">
                          {selectedApplication.user.formations.map(form => (
                            <div key={form.id} className="mb-3">
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
                              <hr className="my-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message de candidature */}
                    <div className="card shadow-sm">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">Message de candidature</h5>
                      </div>
                      <div className="card-body">
                        {selectedApplication.message ? (
                          <div className="bg-light p-3 rounded">
                            <p className="mb-0">{selectedApplication.message}</p>
                          </div>
                        ) : (
                          <p className="text-muted fst-italic">Aucun message fourni par le candidat.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Application;