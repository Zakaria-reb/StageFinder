import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaLaptopHouse
} from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../layouts/UserNavbar';

const NewPost = () => {
  const navigate = useNavigate();
  
  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [ville, setVille] = useState('');
  const [teletravail, setTeletravail] = useState(false);
  const [typeStage, setTypeStage] = useState('');
  const [remunere, setRemunere] = useState(false);
  const [montantRemuneration, setMontantRemuneration] = useState('');
  const [competences, setCompetences] = useState(['']);
  
  // États de la page
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  
  // Vérifier si l'utilisateur est connecté et de type entreprise
  useEffect(() => {
    const checkUserAuthorization = async () => {
      try {
        const response = await axios.get('/api/user');
        
        if (response.data && response.data.type === 'entreprise') {
          setCurrentUser(response.data);
          setUnauthorized(false);
        } else {
          setUnauthorized(true);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur:", err);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAuthorization();
  }, []);
  
  // Options pour les types de stages
  const typeStageOptions = [
    { value: '', label: 'Sélectionnez un type...' },
    { value: 'stage_observation', label: 'Stage d\'observation' },
    { value: 'stage_execution', label: 'Stage d\'exécution' },
    { value: 'stage_fin_etudes', label: "Stage de fin d'études" },
    { value: 'alternance', label: 'Alternance' },
    { value: 'pfe', label: 'Projet de Fin d\'Études' },
  ];
  
  // Options pour les domaines (adaptés au Maroc)
  const domainOptions = [
    { value: '', label: 'Sélectionnez un domaine...' },
    { value: 'informatique', label: 'Informatique et Digital' },
    { value: 'ingenierie', label: 'Ingénierie' },
    { value: 'commerce', label: 'Commerce et Marketing' },
    { value: 'finance', label: 'Finance et Comptabilité' },
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'design', label: 'Design et Multimédia' },
    { value: 'communication', label: 'Communication' },
    { value: 'sante', label: 'Santé et Paramédical' },
    { value: 'tourisme', label: 'Tourisme et Hôtellerie' },
    { value: 'agriculture', label: 'Agriculture et Agroalimentaire' },
    { value: 'autre', label: 'Autre' },
  ];
  
  // Villes marocaines
  const villeOptions = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 
    'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan',
    'Safi', 'El Jadida', 'Béni Mellal', 'Nador', 'Taza',
    'Autre'
  ];
  
  // Gestion des champs de compétences
  const handleCompetenceChange = (index, value) => {
    const updatedCompetences = [...competences];
    updatedCompetences[index] = value;
    setCompetences(updatedCompetences);
  };
  
  const addCompetenceField = () => {
    setCompetences([...competences, '']);
  };
  
  const removeCompetenceField = (index) => {
    const updatedCompetences = competences.filter((_, i) => i !== index);
    setCompetences(updatedCompetences);
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!title.trim()) errors.title = 'Le titre est obligatoire';
    if (!description.trim()) errors.description = 'La description est obligatoire';
    if (!domain) errors.domain = 'Le domaine est obligatoire';
    if (!dateDebut) errors.dateDebut = 'La date de début est obligatoire';
    if (!dateFin) errors.dateFin = 'La date de fin est obligatoire';
    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
      errors.dateFin = 'La date de fin doit être après la date de début';
    }
    if (!ville.trim()) errors.ville = 'La ville est obligatoire';
    if (!typeStage) errors.typeStage = 'Le type de stage est obligatoire';
    if (remunere && !montantRemuneration) {
      errors.montantRemuneration = 'Le montant est obligatoire pour les stages rémunérés';
    }
    
    // Vérifier les compétences non vides
    const filteredCompetences = competences.filter(comp => comp.trim() !== '');
    if (filteredCompetences.length === 0) {
      errors.competences = 'Au moins une compétence est requise';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }
    
    // Filtrer les compétences vides
    const filteredCompetences = competences.filter(comp => comp.trim() !== '');
    
    setSubmitting(true);
    setError(null);
    
    try {
      const postData = {
        title,
        description,
        domain,
        date_debut: dateDebut,
        date_fin: dateFin,
        ville,
        teletravail,
        type_stage: typeStage,
        remunere,
        montant_remuneration: remunere ? montantRemuneration : null,
        competences: filteredCompetences
      };
      
      const response = await axios.post('/api/posts', postData);
      
      // Naviguer vers la page du post créé
      navigate(`/PostDetail/${response.data.post.id}`, {
        state: { message: 'Votre offre a été créée avec succès !' }
      });
    } catch (err) {
      console.error('Erreur lors de la création de l\'offre:', err);
      setError(err.response?.data?.message || 'Échec de la création de l\'offre. Veuillez réessayer.');
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Page de chargement
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement en cours...</p>
        </div>
      </div>
    );
  }
  
  // Page d'accès non autorisé
  if (unauthorized) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Accès refusé</h4>
            <p>Vous devez être connecté en tant qu'entreprise pour créer des offres.</p>
            <hr />
            <div className="d-flex justify-content-center">
              <Link to="/login" className="btn btn-outline-primary me-2">Connexion</Link>
              <Link to="/register" className="btn btn-primary">S'inscrire en tant qu'entreprise</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="new-post-page">
      <Navbar />
      
      <div className="container mt-4 mb-5">
        <div className="row mb-4">
          <div className="col-12">
            <Link to="/Offre" className="btn btn-outline-secondary">
              <FaArrowLeft className="me-2" /> Retour aux offres
            </Link>
          </div>
        </div>
        
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h3 className="mb-0">Créer une nouvelle offre de stage</h3>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                <FaExclamationTriangle className="me-2" /> {error}
              </div>
            )}
            
            {Object.keys(formErrors).length > 0 && (
              <div className="alert alert-warning mb-4" role="alert">
                <FaExclamationTriangle className="me-2" /> Veuillez corriger les erreurs ci-dessous
                <ul className="mb-0 mt-2">
                  {Object.values(formErrors).map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="title" className="form-label">Titre de l'offre <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                    id="title"
                    placeholder="Ex: Stagiaire en développement web"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                </div>
                
                <div className="col-12 mb-3">
                  <label htmlFor="description" className="form-label">Description détaillée <span className="text-danger">*</span></label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    rows="8"
                    placeholder="Décrivez les missions du stage, les compétences requises et ce que le stagiaire apprendra..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                  <small className="text-muted">Utilisez des paragraphes pour une meilleure lisibilité.</small>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="domain" className="form-label">Domaine <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${formErrors.domain ? 'is-invalid' : ''}`}
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    {domainOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {formErrors.domain && <div className="invalid-feedback">{formErrors.domain}</div>}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="typeStage" className="form-label">Type de stage <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${formErrors.typeStage ? 'is-invalid' : ''}`}
                    id="typeStage"
                    value={typeStage}
                    onChange={(e) => setTypeStage(e.target.value)}
                  >
                    {typeStageOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {formErrors.typeStage && <div className="invalid-feedback">{formErrors.typeStage}</div>}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="dateDebut" className="form-label">Date de début <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaCalendarAlt />
                    </span>
                    <input
                      type="date"
                      className={`form-control ${formErrors.dateDebut ? 'is-invalid' : ''}`}
                      id="dateDebut"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                    />
                    {formErrors.dateDebut && <div className="invalid-feedback">{formErrors.dateDebut}</div>}
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="dateFin" className="form-label">Date de fin <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaCalendarAlt />
                    </span>
                    <input
                      type="date"
                      className={`form-control ${formErrors.dateFin ? 'is-invalid' : ''}`}
                      id="dateFin"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                    />
                    {formErrors.dateFin && <div className="invalid-feedback">{formErrors.dateFin}</div>}
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="ville" className="form-label">Ville <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaMapMarkerAlt />
                    </span>
                    <select
                      className={`form-control ${formErrors.ville ? 'is-invalid' : ''}`}
                      id="ville"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                    >
                      <option value="">Sélectionnez une ville</option>
                      {villeOptions.map((ville, index) => (
                        <option key={index} value={ville}>{ville}</option>
                      ))}
                    </select>
                    {formErrors.ville && <div className="invalid-feedback">{formErrors.ville}</div>}
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Télétravail possible</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="teletravail"
                        checked={teletravail}
                        onChange={(e) => setTeletravail(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="teletravail">
                        {teletravail ? 'Oui' : 'Non'}
                      </label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaLaptopHouse className="text-primary me-2" />
                    <small className="text-muted">
                      Cochez "Oui" si ce stage peut être fait en totalité ou partie à distance
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Stage rémunéré</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remunere"
                        checked={remunere}
                        onChange={(e) => setRemunere(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="remunere">
                        {remunere ? 'Oui' : 'Non'}
                      </label>
                    </div>
                  </div>
                  
                  {remunere && (
                    <div className="mt-2">
                      <label htmlFor="montantRemuneration" className="form-label">Montant (DH) <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaMoneyBillWave />
                        </span>
                        <input
                          type="number"
                          className={`form-control ${formErrors.montantRemuneration ? 'is-invalid' : ''}`}
                          id="montantRemuneration"
                          placeholder="Ex: 2000"
                          value={montantRemuneration}
                          onChange={(e) => setMontantRemuneration(e.target.value)}
                          min="0"
                          step="100"
                        />
                        {formErrors.montantRemuneration && <div className="invalid-feedback">{formErrors.montantRemuneration}</div>}
                      </div>
                      <small className="text-muted">Le montant minimum légal au Maroc est de 1 500 DH/mois pour les stagiaires de niveau Bac+4 et plus</small>
                    </div>
                  )}
                </div>
                
                <div className="col-12 mb-4">
                  <label className="form-label">Compétences requises <span className="text-danger">*</span></label>
                  {formErrors.competences && <div className="text-danger small mb-2">{formErrors.competences}</div>}
                  
                  {competences.map((competence, index) => (
                    <div className="input-group mb-2" key={index}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: JavaScript, Communication, WordPress..."
                        value={competence}
                        onChange={(e) => handleCompetenceChange(index, e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeCompetenceField(index)}
                        disabled={competences.length === 1}
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addCompetenceField}
                  >
                    <FaPlus className="me-1" /> Ajouter une compétence
                  </button>
                </div>
                
                <div className="col-12 border-top pt-4">
                  <div className="alert alert-info mb-4" role="alert">
                    <FaInfoCircle className="me-2" /> 
                    <strong>Important :</strong> En publiant cette offre, vous vous engagez à respecter la réglementation marocaine relative aux stages.
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <Link to="/Offre" className="btn btn-outline-secondary me-2">
                      Annuler
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Publication en cours...
                        </>
                      ) : (
                        'Publier l\'offre'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;