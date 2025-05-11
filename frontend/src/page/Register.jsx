import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../axiosConfig'; // Importation du service d'authentification
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserGraduate, FaBuilding, FaUserPlus, FaArrowLeft, FaUpload, FaSignInAlt } from 'react-icons/fa';
import '../css/Auth.css'; // Assurez-vous d'importer les styles CSS

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
        navigate('/Dasboard');
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
    <div className="auth-page">
      <div className={`auth-container ${!isLogin ? 'active' : ''}`}>
        {/* FORMULAIRE DE CONNEXION */}
        <div className="auth-form-container auth-sign-in">
          <form onSubmit={handleLogin}>
            <h1 className="auth-visible-title">Se connecter</h1>
            <p>Connectez-vous pour accéder à votre compte</p>
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            
            <a href="#" className="forgot-password-link">Mot de passe oublié ?</a>
            
            <button type="submit" className="auth-submit-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Chargement...
                </>
              ) : (
                <>
                  <FaSignInAlt className="me-1" /> Se connecter
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* FORMULAIRE D'INSCRIPTION */}
        <div className="auth-form-container auth-sign-up">
          <form onSubmit={handleRegister} className="compact-form">
            <h1 className="auth-visible-title">Créer un compte</h1>
            <p>Inscrivez-vous pour accéder à toutes les fonctionnalités</p>
            
            {success ? (
              <div className="alert alert-success">
                <h5>Inscription réussie !</h5>
                <p>Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p>Je suis :</p>
                  <div className="d-flex gap-3">
                    <div 
                      className={`card p-3 flex-grow-1 ${formData.type === 'etudiant' ? 'border-primary' : 'border'}`}
                      role="button"
                      onClick={() => setFormData({...formData, type: 'etudiant'})}
                    >
                      <div className="text-center">
                        <FaUserGraduate size={32} className={formData.type === 'etudiant' ? 'text-primary' : 'text-muted'} />
                        <h5 className="mt-2 mb-0">Étudiant</h5>
                        <p className="text-muted small">Je recherche un stage</p>
                      </div>
                    </div>
                    <div 
                      className={`card p-3 flex-grow-1 ${formData.type === 'entreprise' ? 'border-primary' : 'border'}`}
                      role="button"
                      onClick={() => setFormData({...formData, type: 'entreprise'})}
                    >
                      <div className="text-center">
                        <FaBuilding size={32} className={formData.type === 'entreprise' ? 'text-primary' : 'text-muted'} />
                        <h5 className="mt-2 mb-0">Entreprise</h5>
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
                      placeholder={`Nom ${formData.type === 'entreprise' ? 'de l\'entreprise' : 'complet'}`}
                      value={formData.name}
                      onChange={handleRegisterChange}
                      required
                      className={errors.name ? 'is-invalid' : ''}
                    />
                    {errors.name && <span className="auth-error-message">{errors.name[0]}</span>}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleRegisterChange}
                      required
                      className={errors.email ? 'is-invalid' : ''}
                    />
                    {errors.email && <span className="auth-error-message">{errors.email[0]}</span>}
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <input
                      type="password"
                      name="password"
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleRegisterChange}
                      required
                      className={errors.password ? 'is-invalid' : ''}
                    />
                    {errors.password && <span className="auth-error-message">{errors.password[0]}</span>}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="password"
                      name="password_confirmation"
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
                      placeholder="Téléphone"
                      value={formData.telephone}
                      onChange={handleRegisterChange}
                      className={errors.telephone ? 'is-invalid' : ''}
                    />
                    {errors.telephone && <span className="auth-error-message">{errors.telephone[0]}</span>}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="ville"
                      placeholder="Ville"
                      value={formData.ville}
                      onChange={handleRegisterChange}
                      className={errors.ville ? 'is-invalid' : ''}
                    />
                    {errors.ville && <span className="auth-error-message">{errors.ville[0]}</span>}
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
                          placeholder="École / Université"
                          value={formData.ecole}
                          onChange={handleRegisterChange}
                          className={errors.ecole ? 'is-invalid' : ''}
                        />
                        {errors.ecole && <span className="auth-error-message">{errors.ecole[0]}</span>}
                      </div>
                      <div className="col-md-6">
                        <div className="auth-select-container">
                          <select
                            className={`auth-custom-select ${errors.niveau_etudes ? 'is-invalid' : ''}`}
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
                        </div>
                        {errors.niveau_etudes && <span className="auth-error-message">{errors.niveau_etudes[0]}</span>}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <input
                        type="text"
                        name="specialite"
                        placeholder="Spécialité / Domaine d'études"
                        value={formData.specialite}
                        onChange={handleRegisterChange}
                        className={errors.specialite ? 'is-invalid' : ''}
                      />
                      {errors.specialite && <span className="auth-error-message">{errors.specialite[0]}</span>}
                    </div>
                    
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          type="file"
                          className={`form-control ${errors.cv ? 'is-invalid' : ''}`}
                          id="cv"
                          name="cv"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                        <label className="input-group-text" htmlFor="cv">
                          <FaUpload />
                        </label>
                      </div>
                      {errors.cv && <span className="auth-error-message">{errors.cv[0]}</span>}
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
                        placeholder="Secteur d'activité"
                        value={formData.secteur_activite}
                        onChange={handleRegisterChange}
                        className={errors.secteur_activite ? 'is-invalid' : ''}
                      />
                      {errors.secteur_activite && <span className="auth-error-message">{errors.secteur_activite[0]}</span>}
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="url"
                          name="site_web"
                          placeholder="Site web"
                          value={formData.site_web}
                          onChange={handleRegisterChange}
                          className={errors.site_web ? 'is-invalid' : ''}
                        />
                        {errors.site_web && <span className="auth-error-message">{errors.site_web[0]}</span>}
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          name="adresse"
                          placeholder="Adresse"
                          value={formData.adresse}
                          onChange={handleRegisterChange}
                          className={errors.adresse ? 'is-invalid' : ''}
                        />
                        {errors.adresse && <span className="auth-error-message">{errors.adresse[0]}</span>}
                      </div>
                    </div>
                  </>
                )}
                
                <button
                  type="submit"
                  className="auth-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-1" /> S'inscrire
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
              <h1>Bon retour !</h1>
              <p>Connectez-vous avec vos informations personnelles pour accéder à votre espace</p>
              <button className="auth-hidden" onClick={toggleForm}>Se connecter</button>
            </div>
            
            {/* Panneau droit (visible quand on est sur la connexion) */}
            <div className="auth-toggle-panel auth-toggle-right">
              <h1>Salut !</h1>
              <p>Inscrivez-vous pour accéder à toutes les fonctionnalités et commencer votre parcours</p>
              <button className="auth-hidden" onClick={toggleForm}>S'inscrire</button>
            </div>
          </div>
        </div>
        
        {/* MESSAGE */}
        {message && (
          <div className={`auth-message ${message.toLowerCase().includes('erreur') ? 'error' : ''}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;