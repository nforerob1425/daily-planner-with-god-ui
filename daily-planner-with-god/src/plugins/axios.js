import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tu-api.com', // Cambia esto por la URL base de tu API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;