import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../layouts/UserNavbar';

import { 
  FaUser, 
  FaBriefcase, 
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFileAlt,
  FaChevronLeft,
  FaCheck,
  FaTimes,
  FaDownload,
  FaList,
  FaHistory,
  FaBook,
  FaExclamationTriangle
} from 'react-icons/fa';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        // Suppression de la vérification de token
        
        const response = await axios.get(`/api/applications/${id}`);
        // Pas besoin d'ajouter les headers d'authentification
        
        setApplication(response.data);
        
        // Si un CV est disponible, préparer l'URL
        if (response.data.user.cv_path) {
          setPdfUrl(`/storage/${response.data.user.cv_path}`);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails de la candidature', error);
        
        // Message d'erreur détaillé
        if (error.response) {
          // La requête a été faite et le serveur a répondu avec un code d'état qui
          // n'est pas dans la plage 2xx
          const serverMessage = error.response.data?.message || 'Erreur serveur';
          setError(`${serverMessage} (${error.response.status})`);
        } else if (error.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          setError('Aucune réponse du serveur. Vérifiez votre connexion internet.');
        } else {
          // Une erreur s'est produite lors de la configuration de la demande
          setError(`Erreur: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    try {
      setLoading(true);
      // Suppression de la vérification de token
      
      await axios.put(`/api/applications/${id}/status`, { status });
      // Pas besoin d'ajouter les headers d'authentification
      
      // Mettre à jour les données locales
      const updatedApplication = await axios.get(`/api/applications/${id}`);
      setApplication(updatedApplication.data);
      
      // Afficher un message de confirmation
      alert(`Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
      
      if (error.response) {
        setError(`Erreur: ${error.response.data?.message || 'Erreur serveur'} (${error.response.status})`);
      } else if (error.request) {
        setError('Aucune réponse du serveur. Vérifiez votre connexion internet.');
      } else {
        setError(`Erreur: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="application-details-container bg-light min-vh-100">
        <Navbar />
        <div className="container py-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-5">
              <FaExclamationTriangle className="text-danger mb-4" size={60} />
              <h3 className="mb-3">Une erreur s'est produite</h3>
              <p className="mb-4 text-muted">{error}</p>
              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loader pendant le chargement des données
  if (loading) {
    return (
      <div className="application-details-container bg-light min-vh-100">
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des détails de la candidature...</p>
        </div>
      </div>
    );
  }

  // Si aucune données n'a été chargée
  if (!application) {
    return (
      <div className="application-details-container bg-light min-vh-100">
        <Navbar />
        <div className="container py-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-5">
              <FaExclamationTriangle className="text-warning mb-4" size={60} />
              <h3 className="mb-3">Données non disponibles</h3>
              <p className="mb-4 text-muted">Impossible de charger les détails de cette candidature.</p>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-details-container bg-light min-vh-100">
      <Navbar />

      <div className="container py-4">
        {/* Bouton retour */}
        <div className="mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline-secondary d-inline-flex align-items-center"
          >
            <FaChevronLeft className="me-2" /> Retour
          </button>
        </div>

        {/* En-tête */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Détails de la candidature</h3>
              <div>
                <span 
                  className={`badge fs-6 ${
                    application.status === 'pending' ? 'bg-warning' : 
                    application.status === 'accepted' ? 'bg-success' : 
                    'bg-danger'
                  }`}
                >
                  {application.status === 'pending' ? 'En attente' : 
                   application.status === 'accepted' ? 'Acceptée' : 
                   'Refusée'}
                </span>
              </div>
            </div>

            <div className="row g-4">
              {/* Le reste du composant reste inchangé */}
              {/* Informations sur l'offre */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-white">
                    <h5 className="mb-0 d-flex align-items-center">
                      <FaBriefcase className="me-2 text-primary" /> Détails de l'offre
                    </h5>
                  </div>
                  <div className="card-body">
                    <h5>{application.post?.title || 'Titre non disponible'}</h5>
                    <div className="mb-3">
                      <p className="text-muted mb-1">
                        <FaCalendarAlt className="me-2" /> 
                        Posté le {application.post?.created_at ? new Date(application.post.created_at).toLocaleDateString() : 'Date inconnue'}
                      </p>
                      {application.post?.ville && (
                        <p className="text-muted mb-1">
                          <FaMapMarkerAlt className="me-2" /> 
                          {application.post.ville}
                        </p>
                      )}
                      {application.post?.domain && (
                        <p className="text-muted mb-1">
                          <FaBriefcase className="me-2" /> 
                          Domaine: {application.post.domain}
                        </p>
                      )}
                      {application.post?.type_stage && (
                        <p className="text-muted mb-1">
                          <FaGraduationCap className="me-2" /> 
                          Type: {application.post.type_stage}
                        </p>
                      )}
                    </div>
                    <div className="d-grid gap-2">
                      {application.post?.id && (
                        <Link to={`/posts/${application.post.id}`} className="btn btn-outline-primary">
                          Voir l'offre complète
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations sur le candidat */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-white">
                    <h5 className="mb-0 d-flex align-items-center">
                      <FaUser className="me-2 text-primary" /> Profil du candidat
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Contenu existant */}
                  </div>
                </div>
              </div>

              {/* Actions sur la candidature - Modifié pour ne plus utiliser la vérification d'authentification locale */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Actions</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="btn btn-success d-flex align-items-center"
                        onClick={() => handleStatusUpdate('accepted')}
                        disabled={application.status === 'accepted' || loading}
                      >
                        <FaCheck className="me-2" /> Accepter la candidature
                      </button>
                      <button 
                        className="btn btn-danger d-flex align-items-center"
                        onClick={() => handleStatusUpdate('rejected')}
                        disabled={application.status === 'rejected' || loading}
                      >
                        <FaTimes className="me-2" /> Refuser la candidature
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;