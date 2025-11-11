import axios from 'axios';

console.log("API:", import.meta.env.VITE_API_URL  );

const API_BASE = import.meta.env.VITE_API_URL;



// const API_BASE = "http://localhost:3005/api";

console.log("API:", API_BASE);



const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
