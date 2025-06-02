import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/finance/',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken') 
  },
  withCredentials: true
});
export default {
  getDepenses() {
    return api.get('/depenses/');
  },
  createDepense(data) {
    return api.post('/depenses/', data);
  },
  
};
// c'est hooks et ca dois etre dans un dossier hooks et la fonction dois s'appeler useGetCooke
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