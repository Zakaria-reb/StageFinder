// auth-axios.js - Correction de l'intercepteur de réponse
import axios from 'axios';

// Configuration de base (inchangée)
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true; 

// Intercepteur pour gérer automatiquement les tokens (inchangé)
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs d'authentification - MODIFIÉ
axios.interceptors.response.use(
  response => response,
  async error => {
    // Ne rediriger automatiquement que pour les pages qui ne sont pas les détails de poste
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      // Supprimer le token si l'authentification a échoué
      localStorage.removeItem('auth_token');
      
      // Ne pas rediriger automatiquement vers /register pour la page de détails de poste
      // C'est important pour que les utilisateurs non authentifiés puissent voir les détails
      const currentPath = window.location.pathname;
      const isPostDetailPage = currentPath.startsWith('/posts/') && !currentPath.includes('/edit/');
      
      if (!isPostDetailPage && window.location.pathname !== '/register') {
        window.location.href = '/register';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function pour les requêtes API avec protection CSRF
const api = {
  get: async (url, config = {}) => {
    try {
      // Obtenir le cookie CSRF d'abord
      await axios.get('/sanctum/csrf-cookie');
      return axios.get(url, config);
    } catch (error) {
      console.error('GET request error:', error);
      throw error;
    }
  },
  
  post: async (url, data = {}, config = {}) => {
    try {
      // Obtenir le cookie CSRF d'abord
      await axios.get('/sanctum/csrf-cookie');
      return axios.post(url, data, config);
    } catch (error) {
      console.error('POST request error:', error);
      throw error;
    }
  },
  
  put: async (url, data = {}, config = {}) => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      return axios.put(url, data, config);
    } catch (error) {
      console.error('PUT request error:', error);
      throw error;
    }
  },
  
  patch: async (url, data = {}, config = {}) => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      return axios.patch(url, data, config);
    } catch (error) {
      console.error('PATCH request error:', error);
      throw error;
    }
  },
  
  delete: async (url, config = {}) => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      return axios.delete(url, config);
    } catch (error) {
      console.error('DELETE request error:', error);
      throw error;
    }
  }
};

// Fonctions d'authentification
const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const response = await api.post('/api/register', userData, config);
      
      // Stockage du token si présent dans la réponse
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Connexion utilisateur
  login: async (credentials) => {
    try {
      const response = await api.post('/api/login', credentials);
      
      // Si un token est retourné, le stocker
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Déconnexion
  logout: async () => {
    try {
      const response = await api.post('/api/logout');
      localStorage.removeItem('auth_token');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Supprimer le token même en cas d'erreur
      localStorage.removeItem('auth_token');
      throw error;
    }
  },
  
  // Récupérer l'utilisateur actuel - MODIFIÉ avec meilleure gestion d'erreurs
  getUser: async () => {
    try {
      const response = await api.get('/api/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      // Si nous obtenons une erreur 401, c'est normal - l'utilisateur n'est pas authentifié
      if (error.response && error.response.status === 401) {
        return null;
      }
      throw error;
    }
  },
  
  // Vérifier si l'utilisateur est authentifié - MODIFIÉ avec vérification plus robuste
  isAuthenticated: () => {
    return localStorage.getItem('auth_token') !== null;
  },

  // Applications (candidatures) - MODIFIÉ avec meilleure gestion d'erreurs
  applications: {
    // Postuler à une offre de stage
    apply: async (postId, message = null) => {
      try {
        const data = { post_id: postId };
        if (message) {
          data.message = message;
        }
        const response = await api.post('/api/applications', data);
        return response.data;
      } catch (error) {
        console.error('Error applying to post:', error);
        throw error;
      }
    },
    
    // Vérifier si l'utilisateur a déjà postulé à une offre - MODIFIÉ pour gérer les erreurs
    checkStatus: async (postId) => {
      try {
        if (!localStorage.getItem('auth_token')) {
          return { hasApplied: false };
        }
        
        const response = await api.get(`/api/applications/check/${postId}`);
        return response.data;
      } catch (error) {
        console.error('Error checking application status:', error);
        // En cas d'erreur, supposons que l'utilisateur n'a pas postulé
        return { hasApplied: false };
      }
    },
    
    // Autres méthodes inchangées...
    getMyApplications: async () => {
      try {
        const response = await api.get('/api/my-applications');
        return response.data;
      } catch (error) {
        console.error('Error fetching user applications:', error);
        throw error;
      }
    },
    
    getReceivedApplications: async () => {
      try {
        const response = await api.get('/api/received-applications');
        return response.data;
      } catch (error) {
        console.error('Error fetching received applications:', error);
        throw error;
      }
    },
    
    updateStatus: async (applicationId, status) => {
      try {
        const response = await api.put(`/api/applications/${applicationId}/status`, { status });
        return response.data;
      } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
      }
    }
  },

  // AJOUT: Fonction debug pour aider à diagnostiquer les problèmes d'authentification
authService.debug = {
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  checkAuth: async () => {
    try {
      // Test simple d'authentification
      const response = await api.get('/api/user', { 
        validateStatus: function (status) {
          return status < 500; // Accepte tous les codes sauf erreur serveur
        }
      });
      
      return {
        authenticated: response.status === 200,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error('Auth debug error:', error);
      return {
        authenticated: false,
        error: error.message
      };
    }
  }
}
};

export { api, authService };
export default axios;