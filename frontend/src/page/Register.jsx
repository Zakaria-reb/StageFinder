import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../axiosConfig'; // Importation du service d'authentification
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Auth.css';
import { 
  FaUserGraduate, 
  FaBuilding, 
  FaUserPlus, 
  FaArrowLeft, 
  FaUpload, 
  FaSignInAlt,
  FaGraduationCap,
  FaLaptopCode
} from 'react-icons/fa';

const AuthPage = () => {
  // État pour déterminer si on est en mode inscription ou connexion
  const [isLogin, setIsLogin] = useState(true);
  
  // États pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // États pour le formulaire d'inscription
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    type: 'etudiant', // Par défaut, type étudiant
    telephone: '',
    ville: '',
    cv: null, // Pour l'upload du CV
    ecole: '',
    niveau_etudes: '',
    specialite: '',
    secteur_activite: '',
    site_web: '',
    adresse: ''
  });
  
  // États pour la gestion des erreurs et du chargement
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  
  const navigate = useNavigate();
  
  // Animation au défilement pour la cohérence avec Home.jsx
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.8) {
          element.classList.add('animate-visible');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    // Déclencher une fois au chargement
    animateOnScroll();

    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
  
  // Rediriger si déjà authentifié
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/Dashboard');
    }
  }, [navigate]);
  
  // Gérer les changements dans les champs du formulaire de connexion
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };
  
  // Gérer les changements dans les champs du formulaire d'inscription
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Nettoyer l'erreur spécifique au champ modifié
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Gérer le changement de fichier CV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        cv: file
      });
      setCvFileName(file.name);
    }
  };
  
  // Soumettre le formulaire de connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Appel à l'API de connexion
      const response = await authService.login(loginData);
      
      setSuccess(true);
      setMessage('Connexion réussie!');
      
      // Redirection après connexion réussie
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1500);
      
    } catch (err) {
      setMessage(err.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };
  
  // Soumettre le formulaire d'inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');
    
    try {
      // Créer un FormData pour gérer l'upload de fichier
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      }
      
      // Utiliser le service d'authentification pour l'inscription
      const response = await authService.register(formDataToSend);
      
      // Si succès, afficher un message et rediriger
      setSuccess(true);
      setMessage('Inscription réussie! Vous allez être redirigé vers la page de connexion...');
      
      setTimeout(() => {
        setIsLogin(true); // Basculer vers le formulaire de connexion
        setSuccess(false);
      }, 2000);
      
    } catch (err) {
      // Gérer les erreurs de validation
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        // Erreur générale
        setMessage(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Basculer entre les formulaires
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setMessage('');
    setSuccess(false);
  };

  // Effacer les messages après un certain temps
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  return (
    <>
      <div className="auth-page position-relative overflow-hidden">
        {/* Éléments flottants */}
        
        
        {/* Pattern overlay */}
        <div className="auth-pattern-overlay"></div>
        
        <div className={`auth-container ${!isLogin ? 'active' : ''}`}>
          {/* FORMULAIRE DE CONNEXION */}
          <div className="auth-form-container auth-sign-in animate-on-scroll">
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <span className="badge badge-glow px-4 py-2 mb-3">Espace Personnel</span>
                <h1 className="auth-visible-title fw-bold">Se connecter</h1>
                <p className="text-muted">Connectez-vous pour accéder à votre compte</p>
              </div>
              
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-pill py-2"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control rounded-pill py-2"
                  placeholder="Mot de passe"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <div className="d-flex justify-content-end mb-4">
                <a href="#" className="text-primary text-decoration-none forgot-password-link">Mot de passe oublié ?</a>
              </div>
              
              <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill pulse-button py-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Chargement...
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="me-2" /> Se connecter
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* FORMULAIRE D'INSCRIPTION */}
          <div className="auth-form-container auth-sign-up animate-on-scroll">
            <form onSubmit={handleRegister} className="compact-form">
              <div className="mb-4">
                <span className="badge badge-glow px-4 py-2 mb-3">Rejoignez-nous</span>
                <h1 className="auth-visible-title fw-bold">Créer un compte</h1>
                <p className="text-muted">Inscrivez-vous pour accéder à toutes les fonctionnalités</p>
              </div>
              
              {success ? (
                <div className="alert custom-alert-success p-4 rounded-lg">
                  <h5 className="fw-bold">Inscription réussie !</h5>
                  <p className="mb-0">Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion...</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="fw-medium">Je suis :</p>
                    <div className="d-flex gap-3">
                      <div 
                        className={`card p-3 flex-grow-1 ${formData.type === 'etudiant' ? 'border-primary profile-card-active' : 'border profile-card'}`}
                        role="button"
                        onClick={() => setFormData({...formData, type: 'etudiant'})}
                      >
                        <div className="text-center">
                          <FaUserGraduate size={32} className={formData.type === 'etudiant' ? 'text-primary' : 'text-muted'} />
                          <h5 className="mt-2 mb-0 fw-bold">Étudiant</h5>
                          <p className="text-muted small">Je recherche un stage</p>
                        </div>
                      </div>
                      <div 
                        className={`card p-3 flex-grow-1 ${formData.type === 'entreprise' ? 'border-primary profile-card-active' : 'border profile-card'}`}
                        role="button"
                        onClick={() => setFormData({...formData, type: 'entreprise'})}
                      >
                        <div className="text-center">
                          <FaBuilding size={32} className={formData.type === 'entreprise' ? 'text-primary' : 'text-muted'} />
                          <h5 className="mt-2 mb-0 fw-bold">Entreprise</h5>
                          <p className="text-muted small">Je recherche des stagiaires</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="name"
                        className={`form-control rounded-pill py-2 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder={`Nom ${formData.type === 'entreprise' ? 'de l\'entreprise' : 'complet'}`}
                        value={formData.name}
                        onChange={handleRegisterChange}
                        required
                      />
                      {errors.name && <span className="invalid-feedback">{errors.name[0]}</span>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        name="email"
                        className={`form-control rounded-pill py-2 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                      {errors.email && <span className="invalid-feedback">{errors.email[0]}</span>}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="password"
                        name="password"
                        className={`form-control rounded-pill py-2 ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                      {errors.password && <span className="invalid-feedback">{errors.password[0]}</span>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        name="password_confirmation"
                        className="form-control rounded-pill py-2"
                        placeholder="Confirmer le mot de passe"
                        value={formData.password_confirmation}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="tel"
                        name="telephone"
                        className={`form-control rounded-pill py-2 ${errors.telephone ? 'is-invalid' : ''}`}
                        placeholder="Téléphone"
                        value={formData.telephone}
                        onChange={handleRegisterChange}
                      />
                      {errors.telephone && <span className="invalid-feedback">{errors.telephone[0]}</span>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="ville"
                        className={`form-control rounded-pill py-2 ${errors.ville ? 'is-invalid' : ''}`}
                        placeholder="Ville"
                        value={formData.ville}
                        onChange={handleRegisterChange}
                      />
                      {errors.ville && <span className="invalid-feedback">{errors.ville[0]}</span>}
                    </div>
                  </div>
                  
                  {/* Champs spécifiques aux étudiants */}
                  {formData.type === 'etudiant' && (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            name="ecole"
                            className={`form-control rounded-pill py-2 ${errors.ecole ? 'is-invalid' : ''}`}
                            placeholder="École / Université"
                            value={formData.ecole}
                            onChange={handleRegisterChange}
                          />
                          {errors.ecole && <span className="invalid-feedback">{errors.ecole[0]}</span>}
                        </div>
                        <div className="col-md-6">
                          <select
                            className={`form-select rounded-pill py-2 ${errors.niveau_etudes ? 'is-invalid' : ''}`}
                            name="niveau_etudes"
                            value={formData.niveau_etudes}
                            onChange={handleRegisterChange}
                          >
                            <option value="">Sélectionnez un niveau</option>
                            <option value="Bac+1">Bac+1</option>
                            <option value="Bac+2">Bac+2</option>
                            <option value="Bac+3">Bac+3 / Licence</option>
                            <option value="Bac+4">Bac+4 / Master 1</option>
                            <option value="Bac+5">Bac+5 / Master 2</option>
                            <option value="Doctorat">Doctorat</option>
                          </select>
                          {errors.niveau_etudes && <span className="invalid-feedback">{errors.niveau_etudes[0]}</span>}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <input
                          type="text"
                          name="specialite"
                          className={`form-control rounded-pill py-2 ${errors.specialite ? 'is-invalid' : ''}`}
                          placeholder="Spécialité / Domaine d'études"
                          value={formData.specialite}
                          onChange={handleRegisterChange}
                        />
                        {errors.specialite && <span className="invalid-feedback">{errors.specialite[0]}</span>}
                      </div>
                      
                      <div className="mb-3">
                        <div className="input-group">
                          <input
                            type="file"
                            className={`form-control rounded-pill py-2 ${errors.cv ? 'is-invalid' : ''}`}
                            id="cv"
                            name="cv"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                          />
                          <label className="input-group-text rounded-end custom-file-label" htmlFor="cv">
                            <FaUpload />
                          </label>
                        </div>
                        {errors.cv && <span className="invalid-feedback">{errors.cv[0]}</span>}
                        {cvFileName && <div className="form-text">Fichier sélectionné: {cvFileName}</div>}
                      </div>
                    </>
                  )}
                  
                  {/* Champs spécifiques aux entreprises */}
                  {formData.type === 'entreprise' && (
                    <>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="secteur_activite"
                          className={`form-control rounded-pill py-2 ${errors.secteur_activite ? 'is-invalid' : ''}`}
                          placeholder="Secteur d'activité"
                          value={formData.secteur_activite}
                          onChange={handleRegisterChange}
                        />
                        {errors.secteur_activite && <span className="invalid-feedback">{errors.secteur_activite[0]}</span>}
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="url"
                            name="site_web"
                            className={`form-control rounded-pill py-2 ${errors.site_web ? 'is-invalid' : ''}`}
                            placeholder="Site web"
                            value={formData.site_web}
                            onChange={handleRegisterChange}
                          />
                          {errors.site_web && <span className="invalid-feedback">{errors.site_web[0]}</span>}
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            name="adresse"
                            className={`form-control rounded-pill py-2 ${errors.adresse ? 'is-invalid' : ''}`}
                            placeholder="Adresse"
                            value={formData.adresse}
                            onChange={handleRegisterChange}
                          />
                          {errors.adresse && <span className="invalid-feedback">{errors.adresse[0]}</span>}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-pill pulse-button py-2 mt-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Chargement...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="me-2" /> S'inscrire
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
          
          {/* PANELS DE BASCULEMENT */}
          <div className="auth-toggle-container">
            <div className="auth-toggle">
              {/* Panneau gauche (visible quand on est sur l'inscription) */}
              <div className="auth-toggle-panel auth-toggle-left">
                <h1 className="fw-bold">Bon retour !</h1>
                <p className="my-4">Connectez-vous avec vos informations personnelles pour accéder à votre espace</p>
                <button className="btn btn-outline-light rounded-pill px-5 py-2 hover-slide-right" onClick={toggleForm}>
                  Se connecter <FaSignInAlt className="ms-2" />
                </button>
              </div>
              
              {/* Panneau droit (visible quand on est sur la connexion) */}
              <div className="auth-toggle-panel auth-toggle-right">
                <h1 className="fw-bold">Salut !</h1>
                <p className="my-4">Inscrivez-vous pour accéder à toutes les fonctionnalités et commencer votre parcours</p>
                <button className="btn btn-outline-light rounded-pill px-5 py-2 hover-slide-right" onClick={toggleForm}>
                  S'inscrire <FaUserPlus className="ms-2" />
                </button>
              </div>
            </div>
          </div>
          
          {/* MESSAGE */}
          {message && (
            <div className={`auth-message ${success ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
        
        {/* Vague de transition */}
        <div className="auth-bottom-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,128C96,160,192,224,288,229.3C384,235,480,181,576,165.3C672,149,768,171,864,181.3C960,192,1056,192,1152,165.3C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
</>
  )
      };


 export default AuthPage;   