// src/services/api.js
import axios from 'axios';

// Fonction pour récupérer le cookie (version utilitaire)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Configuration de base Axios
export const api = axios.create({
  baseURL: 'http://localhost:8000/api/finance/',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  },
  withCredentials: true
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Services API
const apiService = {
  // === DEPENSES ===
  getDepenses() {
    return api.get('/depenses/');
  },

  createDepense(data) {
    return api.post('/depenses/', data);
  },

  updateDepense(id, data) {
    return api.put(`/depenses/${id}/`, data);
  },

  deleteDepense(id) {
    return api.delete(`/depenses/${id}/`);
  },

  // === TAGS ===
  getTags() {
    return api.get('/tags/');
  },

  createTag(data) {
    return api.post('/tags/', data);
  },

  updateTag(id, data) {
    return api.put(`/tags/${id}/`, data);
  },

  deleteTag(id) {
    return api.delete(`/tags/${id}/`);
  },

  // === ANALYTICS ===
  getAnalytics() {
    return api.get('/analytics/');
  },

  getAnalyticsByPeriod(startDate, endDate) {
    return api.get(`/analytics/?start=${startDate}&end=${endDate}`);
  },

  // === HEALTH CHECK ===
  async checkHealth() {
    try {
      // Test avec l'endpoint principal
      const response = await axios.get('http://localhost:8000/health/');
      return response.data;
    } catch (error) {
      throw new Error('Connexion au serveur impossible');
    }
  },

  // === TEST CONNECTION ===
  async testConnection() {
    try {
      const health = await this.checkHealth();
      console.log('✅ Connexion API réussie:', health);
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion API:', error);
      return false;
    }
  }
};

export default apiService;