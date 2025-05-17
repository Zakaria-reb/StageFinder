import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaChevronLeft,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
import Navbar from '../layouts/UserNavbar';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    date_debut: '',
    date_fin: '',
    ville: '',
    teletravail: false,
    type_stage: '',
    remunere: false,
    montant_remuneration: '',
    competences: []
  });

  // État pour les compétences en cours de saisie
  const [skillInput, setSkillInput] = useState('');

  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // État pour vérifier si l'utilisateur est propriétaire du post
  const [isOwner, setIsOwner] = useState(false);

  // Liste des domaines pour le dropdown
  const domains = [
    'Information Technology',
    'Engineering',
    'Marketing',
    'Finance',
    'Human Resources',
    'Research',
    'Sales',
    'Customer Service',
    'Design',
    'Legal',
    'Healthcare',
    'Education',
    'Consulting',
    'Operations',
    'Other'
  ];

  // Types de stages pour le dropdown
  const internshipTypes = [
    'Short-term',
    'Long-term', 
    'Summer',
    'Part-time',
    'Full-time',
    'Research',
    'Project-based',
    'Graduate'
  ];

  // Charger les données du post et vérifier le propriétaire
  useEffect(() => {
    const fetchPostAndCheckOwner = async () => {
      setLoading(true);
      try {
        // Récupérer les détails du post
        const postResponse = await axios.get(`/api/posts/${id}`);
        const post = postResponse.data.post;
        
        // Récupérer les informations de l'utilisateur connecté
        const userResponse = await axios.get('/api/user');
        
        // Vérifier si l'utilisateur est le propriétaire du post
        if (userResponse.data.id !== post.user_id) {
          // Si l'utilisateur n'est pas le propriétaire, rediriger vers la page détaillée
          navigate(`/PostDetail/${id}`, { state: { error: "You don't have permission to edit this post" } });
          return;
        }
        
        // Si nous sommes arrivés ici, l'utilisateur est le propriétaire
        setIsOwner(true);
        
        // Formater les dates pour l'input de type date
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };
        
        // Mettre à jour le formulaire avec les données existantes
        setFormData({
          title: post.title || '',
          description: post.description || '',
          domain: post.domain || '',
          date_debut: formatDate(post.date_debut) || '',
          date_fin: formatDate(post.date_fin) || '',
          ville: post.ville || '',
          teletravail: post.teletravail || false,
          type_stage: post.type_stage || '',
          remunere: post.remunere || false,
          montant_remuneration: post.montant_remuneration || '',
          competences: post.competences || []
        });
        
      } catch (err) {
        console.error('Error fetching post data:', err);
        setError('Failed to load post data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndCheckOwner();
  }, [id, navigate]);

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Pour les cases à cocher, utiliser la valeur checked
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      
      // Si la case "remunere" est décochée, effacer le montant
      if (name === 'remunere' && !checked) {
        setFormData({ ...formData, [name]: checked, montant_remuneration: '' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  // Gérer l'ajout d'une compétence
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.competences.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        competences: [...formData.competences, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  // Gérer la suppression d'une compétence
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      competences: formData.competences.filter(skill => skill !== skillToRemove)
    });
  };

  // Gérer l'appui sur la touche "Entrée" dans le champ de compétence
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.domain) {
      errors.domain = 'Field/Domain is required';
    }
    
    if (!formData.date_debut) {
      errors.date_debut = 'Start date is required';
    }
    
    if (!formData.date_fin) {
      errors.date_fin = 'End date is required';
    } else if (new Date(formData.date_fin) <= new Date(formData.date_debut)) {
      errors.date_fin = 'End date must be after start date';
    }
    
    if (!formData.ville.trim()) {
      errors.ville = 'Location is required';
    }
    
    if (!formData.type_stage) {
      errors.type_stage = 'Internship type is required';
    }
    
    if (formData.remunere && !formData.montant_remuneration) {
      errors.montant_remuneration = 'Please specify compensation amount';
    }
    
    if (formData.competences.length === 0) {
      errors.competences = 'Please add at least one required skill';
    }
    
    return errors;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Faire défiler jusqu'à la première erreur
      const firstErrorField = document.querySelector('.is-invalid');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }
    
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      // Envoyer les données mises à jour au serveur
      await axios.put(`/api/posts/${id}`, formData);
      
      // Marquer la sauvegarde comme réussie
      setSaveSuccess(true);
      
      // Rediriger vers la page de détail après un court délai
      setTimeout(() => {
        navigate(`/PostDetail/${id}`, { state: { message: 'Post updated successfully' } });
      }, 1500);
      
    } catch (err) {
      console.error('Error updating post:', err);
      
      // Gérer les erreurs de validation du serveur
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to update post. Please try again.');
      }
      
      // Faire défiler jusqu'au message d'erreur
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading post data...</p>
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
              <Link to={`/PostDetail/${id}`} className="btn btn-outline-primary">
                <FaChevronLeft className="me-2" /> Back to post details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    // Ce cas devrait être géré par la redirection dans useEffect
    return null;
  }

  return (
    <div className="edit-post-page">
      <Navbar />
      
      <div className="container mt-4 mb-5">
        <div className="row mb-4">
          <div className="col-12">
            <Link to={`/PostDetail/${id}`} className="btn btn-outline-secondary">
              <FaChevronLeft className="me-2" /> Back to post details
            </Link>
          </div>
        </div>
        
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h3 className="mb-0">Edit Internship Opportunity</h3>
          </div>
          
          <div className="card-body">
            {error && (
              <div className="alert alert-danger mb-4">
                <FaExclamationTriangle className="me-2" /> {error}
              </div>
            )}
            
            {saveSuccess && (
              <div className="alert alert-success mb-4">
                <FaCheck className="me-2" /> Post updated successfully!
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Titre */}
              <div className="mb-4">
                <label htmlFor="title" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Web Development Intern"
                />
                {validationErrors.title && (
                  <div className="invalid-feedback">{validationErrors.title}</div>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                  id="description"
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the role, responsibilities, and what the intern will learn..."
                ></textarea>
                {validationErrors.description && (
                  <div className="invalid-feedback">{validationErrors.description}</div>
                )}
              </div>
              
              <div className="row">
                {/* Domaine */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="domain" className="form-label">
                    Field/Domain <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${validationErrors.domain ? 'is-invalid' : ''}`}
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a field</option>
                    {domains.map((domain, index) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {validationErrors.domain && (
                    <div className="invalid-feedback">{validationErrors.domain}</div>
                  )}
                </div>
                
                {/* Type de stage */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="type_stage" className="form-label">
                    Internship Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${validationErrors.type_stage ? 'is-invalid' : ''}`}
                    id="type_stage"
                    name="type_stage"
                    value={formData.type_stage}
                    onChange={handleInputChange}
                  >
                    <option value="">Select internship type</option>
                    {internshipTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {validationErrors.type_stage && (
                    <div className="invalid-feedback">{validationErrors.type_stage}</div>
                  )}
                </div>
              </div>
              
              <div className="row">
                {/* Date de début */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="date_debut" className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${validationErrors.date_debut ? 'is-invalid' : ''}`}
                    id="date_debut"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleInputChange}
                  />
                  {validationErrors.date_debut && (
                    <div className="invalid-feedback">{validationErrors.date_debut}</div>
                  )}
                </div>
                
                {/* Date de fin */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="date_fin" className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${validationErrors.date_fin ? 'is-invalid' : ''}`}
                    id="date_fin"
                    name="date_fin"
                    value={formData.date_fin}
                    onChange={handleInputChange}
                  />
                  {validationErrors.date_fin && (
                    <div className="invalid-feedback">{validationErrors.date_fin}</div>
                  )}
                </div>
              </div>
              
              <div className="row">
                {/* Ville */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="ville" className="form-label">
                    Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.ville ? 'is-invalid' : ''}`}
                    id="ville"
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    placeholder="e.g. Paris, France"
                  />
                  {validationErrors.ville && (
                    <div className="invalid-feedback">{validationErrors.ville}</div>
                  )}
                </div>
                
                {/* Télétravail */}
                <div className="col-md-6 mb-4">
                  <div className="form-check form-switch mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="teletravail"
                      name="teletravail"
                      checked={formData.teletravail}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="teletravail">
                      Remote work available
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                {/* Rémunération */}
                <div className="col-md-6 mb-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remunere"
                      name="remunere"
                      checked={formData.remunere}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="remunere">
                      Paid internship
                    </label>
                  </div>
                </div>
                
                {/* Montant de la rémunération */}
                {formData.remunere && (
                  <div className="col-md-6 mb-4">
                    <label htmlFor="montant_remuneration" className="form-label">
                      Compensation Amount (€) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${validationErrors.montant_remuneration ? 'is-invalid' : ''}`}
                      id="montant_remuneration"
                      name="montant_remuneration"
                      value={formData.montant_remuneration}
                      onChange={handleInputChange}
                      placeholder="e.g. 600"
                      min="0"
                      step="0.01"
                    />
                    {validationErrors.montant_remuneration && (
                      <div className="invalid-feedback">{validationErrors.montant_remuneration}</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Compétences requises */}
              <div className="mb-4">
                <label className="form-label">
                  Required Skills <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. JavaScript"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddSkill}
                  >
                    Add
                  </button>
                </div>
                
                <div className="skills-container mt-2">
                  {formData.competences && formData.competences.length > 0 ? (
                    formData.competences.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button
                          type="button"
                          className="btn-close ms-2"
                          onClick={() => handleRemoveSkill(skill)}
                        ></button>
                      </span>
                    ))
                  ) : (
                    <p className="text-muted small">No skills added yet</p>
                  )}
                </div>
                
                {validationErrors.competences && (
                  <div className="text-danger small mt-2">{validationErrors.competences}</div>
                )}
              </div>
              
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link to={`/PostDetail/${id}`} className="btn btn-outline-secondary">
                  <FaTimes className="me-2" /> Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="me-2 fa-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;