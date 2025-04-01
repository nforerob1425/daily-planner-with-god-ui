import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44341', // Cambia esto por la URL base de tu API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;