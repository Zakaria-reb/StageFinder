import React, { useState } from 'react';
import axios from 'axios';

export default function LoginForm() {
  // État pour les champs du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  
  // État pour gérer les messages (succès/erreur)
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestionnaire de changement pour les inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Effacer l'erreur quand l'utilisateur commence à corriger
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Fonction de validation du formulaire
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    
    // Validation de l'email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
      isValid = false;
    }
    
    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Appel à l'API Laravel
      const response = await axios.post('http://localhost:8000/api/login', {
        email: formData.email,
        password: formData.password,
        remember_me: formData.rememberMe
      });
      
      // Traitement de la réponse
      if (response.data.token) {
        // Sauvegarder le token dans le localStorage ou sessionStorage
        localStorage.setItem('token', response.data.token);
        setMessage('Connexion réussie! Redirection...');
        
        // Redirection vers la page d'accueil après 1.5 secondes
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error) {
      // Gestion des erreurs
      if (error.response) {
        // Réponse avec erreur du serveur
        setMessage(error.response.data.message || 'Échec de la connexion');
        
        // Si le serveur renvoie des erreurs de validation
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      } else {
        setMessage('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Connexion</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${message.includes('réussie') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Adresse email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">Se souvenir de moi</label>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </button>
                </div>
              </form>
              
              <div className="mt-3 text-center">
                <p>Vous n'avez pas de compte? <a href="/register">S'inscrire</a></p>
                <p><a href="/forgot-password">Mot de passe oublié?</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}