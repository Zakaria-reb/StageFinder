// auth-axios.js - Configuration Axios optimisée pour Laravel Sanctum
import axios from 'axios';

// Configuration de base
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true; // Important pour les cookies CSRF et l'authentification

// Intercepteur pour gérer automatiquement les tokens
axios.interceptors.request.use(config => {
  // Récupérer le token depuis localStorage si disponible
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  response => response,
  async error => {
    // Gérer les erreurs 401 (non authentifié) ou 419 (session expirée)
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      // Supprimer le token si l'authentification a échoué
      localStorage.removeItem('auth_token');
      
      // Rediriger vers la page de connexion si nécessaire
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
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
      // Assurez-vous que le type de contenu est correctement défini pour les formulaires avec fichiers
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const response = await api.post('/api/register', userData, config);
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
  
  // Récupérer l'utilisateur actuel
  getUser: async () => {
    try {
      const response = await api.get('/api/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  
  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => {
    return localStorage.getItem('auth_token') !== null;
  },


  
  // Fonctions pour la gestion des posts (offres de stage)
  posts: {
    // Récupérer tous les posts
    getAll: async (params = {}) => {
      try {
        const response = await api.get('/api/posts', { params });
        return response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    },
    
    // Récupérer un post spécifique
    get: async (id) => {
      try {
        const response = await api.get(`/api/posts/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching post ${id}:`, error);
        throw error;
      }
    },
    
    // Créer un nouveau post
    create: async (postData) => {
      try {
        const response = await api.post('/api/posts', postData);
        return response.data;
      } catch (error) {
        console.error('Error creating post:', error);
        throw error;
      }
    },
    
    // Mettre à jour un post existant
    update: async (id, postData) => {
      try {
        const response = await api.put(`/api/posts/${id}`, postData);
        return response.data;
      } catch (error) {
        console.error(`Error updating post ${id}:`, error);
        throw error;
      }
    },
    
    // Supprimer un post
    delete: async (id) => {
      try {
        const response = await api.delete(`/api/posts/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting post ${id}:`, error);
        throw error;
      }
    },
    
    // Récupérer les posts d'un utilisateur
    getUserPosts: async () => {
      try {
        const response = await api.get('/api/user/posts');
        return response.data;
      } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
      }
    }
  }
};


export { api, authService };
export default axios;