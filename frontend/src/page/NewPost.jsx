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
  FaEuroSign,
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
        console.error("Error fetching user data:", err);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAuthorization();
  }, []);
  
  // Options pour les types de stages
  const typeStageOptions = [
    { value: '', label: 'Select a type...' },
    { value: 'stage_observation', label: 'Observation Internship' },
    { value: 'stage_execution', label: 'Execution Internship' },
    { value: 'stage_fin_etudes', label: "End of Studies Internship" },
    { value: 'alternance', label: 'Work-Study Program' },
  ];
  
  // Options pour les domaines
  const domainOptions = [
    { value: '', label: 'Select a field...' },
    { value: 'informatique', label: 'Computer Science' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'rh', label: 'Human Resources' },
    { value: 'design', label: 'Design' },
    { value: 'communication', label: 'Communication' },
    { value: 'autre', label: 'Other' },
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
    
    if (!title.trim()) errors.title = 'Title is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!domain) errors.domain = 'Field is required';
    if (!dateDebut) errors.dateDebut = 'Start date is required';
    if (!dateFin) errors.dateFin = 'End date is required';
    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
      errors.dateFin = 'End date must be after start date';
    }
    if (!ville.trim()) errors.ville = 'Location is required';
    if (!typeStage) errors.typeStage = 'Internship type is required';
    if (remunere && !montantRemuneration) {
      errors.montantRemuneration = 'Compensation amount is required for paid internships';
    }
    
    // Vérifier les compétences non vides
    const filteredCompetences = competences.filter(comp => comp.trim() !== '');
    if (filteredCompetences.length === 0) {
      errors.competences = 'At least one skill is required';
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
        state: { message: 'Your opportunity has been created successfully!' }
      });
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create your opportunity. Please try again.');
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
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading...</p>
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
            <h4 className="alert-heading">Access Denied</h4>
            <p>You must be logged in as an employer to create new opportunities.</p>
            <hr />
            <div className="d-flex justify-content-center">
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-primary">Register as an Employer</Link>
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
              <FaArrowLeft className="me-2" /> Back to opportunities
            </Link>
          </div>
        </div>
        
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h3 className="mb-0">Create New Internship Opportunity</h3>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                <FaExclamationTriangle className="me-2" /> {error}
              </div>
            )}
            
            {Object.keys(formErrors).length > 0 && (
              <div className="alert alert-warning mb-4" role="alert">
                <FaExclamationTriangle className="me-2" /> Please correct the errors below
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
                  <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                    id="title"
                    placeholder="e.g. Web Developer Intern"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                </div>
                
                <div className="col-12 mb-3">
                  <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    rows="8"
                    placeholder="Describe the internship responsibilities, requirements, and what the student will learn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                  <small className="text-muted">Format the description with blank lines for better readability.</small>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="domain" className="form-label">Field <span className="text-danger">*</span></label>
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
                  <label htmlFor="typeStage" className="form-label">Internship Type <span className="text-danger">*</span></label>
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
                  <label htmlFor="dateDebut" className="form-label">Start Date <span className="text-danger">*</span></label>
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
                  <label htmlFor="dateFin" className="form-label">End Date <span className="text-danger">*</span></label>
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
                  <label htmlFor="ville" className="form-label">Location <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaMapMarkerAlt />
                    </span>
                    <input
                      type="text"
                      className={`form-control ${formErrors.ville ? 'is-invalid' : ''}`}
                      id="ville"
                      placeholder="e.g. Paris"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                    />
                    {formErrors.ville && <div className="invalid-feedback">{formErrors.ville}</div>}
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Remote Work Available</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="teletravail"
                        checked={teletravail}
                        onChange={(e) => setTeletravail(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="teletravail">
                        {teletravail ? 'Yes' : 'No'}
                      </label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaLaptopHouse className="text-primary me-2" />
                    <small className="text-muted">
                      Select "Yes" if this internship can be done fully or partially remotely
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Paid Internship</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remunere"
                        checked={remunere}
                        onChange={(e) => setRemunere(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="remunere">
                        {remunere ? 'Yes' : 'No'}
                      </label>
                    </div>
                  </div>
                  
                  {remunere && (
                    <div className="mt-2">
                      <label htmlFor="montantRemuneration" className="form-label">Amount (€) <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEuroSign />
                        </span>
                        <input
                          type="number"
                          className={`form-control ${formErrors.montantRemuneration ? 'is-invalid' : ''}`}
                          id="montantRemuneration"
                          placeholder="e.g. 600"
                          value={montantRemuneration}
                          onChange={(e) => setMontantRemuneration(e.target.value)}
                          min="0"
                          step="0.01"
                        />
                        {formErrors.montantRemuneration && <div className="invalid-feedback">{formErrors.montantRemuneration}</div>}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="col-12 mb-4">
                  <label className="form-label">Required Skills <span className="text-danger">*</span></label>
                  {formErrors.competences && <div className="text-danger small mb-2">{formErrors.competences}</div>}
                  
                  {competences.map((competence, index) => (
                    <div className="input-group mb-2" key={index}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. JavaScript, Communication, WordPress..."
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
                    <FaPlus className="me-1" /> Add Skill
                  </button>
                </div>
                
                <div className="col-12 border-top pt-4">
                  <div className="alert alert-info mb-4" role="alert">
                    <FaInfoCircle className="me-2" /> 
                    <strong>Reminder:</strong> By posting this opportunity, you agree to follow all applicable labor and internship regulations.
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <Link to="/Offre" className="btn btn-outline-secondary me-2">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        'Create Opportunity'
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