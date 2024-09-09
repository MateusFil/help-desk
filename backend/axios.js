// src/axios.js ou src/config.js
import axios from 'axios';

// Obtendo o token CSRF do meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
} else {
  console.warn('CSRF token not found. Make sure you have a <meta> tag with name="csrf-token" in your HTML.');
}

// Exportando o axios configurado
export default axios;
