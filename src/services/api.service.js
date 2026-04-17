import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Interceptor para añadir el token automáticamente
API.interceptors.request.use(config => {
  const token = localStorage.getItem('smarttask_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor para manejar errores globalmente
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smarttask_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────
export const authService = {
  login: (datos) => API.post('/auth/login', datos),
  registro: (datos) => API.post('/auth/registro', datos),
  perfil: () => API.get('/auth/perfil'),
  actualizarPerfil: (datos) => API.put('/auth/perfil', datos),
  cambiarPassword: (datos) => API.put('/auth/cambiar-password', datos),
  eliminarCuenta: (datos) => API.delete('/auth/cuenta', { data: datos })
};

// ─── Tareas ───────────────────────────────────────────
export const tareaService = {
  obtenerTodas: (params) => API.get('/tasks', { params }),
  obtener: (id) => API.get(`/tasks/${id}`),
  crear: (datos) => API.post('/tasks', datos),
  actualizar: (id, datos) => API.put(`/tasks/${id}`, datos),
  eliminar: (id) => API.delete(`/tasks/${id}`),
  cambiarEstado: (id, estado) => API.patch(`/tasks/${id}/estado`, { estado }),
  toggleSubtarea: (tareaId, subtareaId) => API.patch(`/tasks/${tareaId}/subtareas/${subtareaId}/toggle`),
  agregarSubtareas: (tareaId, subtareas, generadoPorIA = false) =>
    API.post(`/tasks/${tareaId}/subtareas`, { subtareas, generadoPorIA })
};

// ─── IA ───────────────────────────────────────────────
export const iaService = {
  generarSubtareas: (tareaId) => API.post('/ai/generar-subtareas', { tareaId }),
  analizarCarga: () => API.get('/ai/analizar-carga'),
  sugerirDescripcion: (datos) => API.post('/ai/sugerir-descripcion', datos)
};

// ─── Estadísticas ─────────────────────────────────────
export const statsService = {
  dashboard: () => API.get('/stats/dashboard'),
  productividad: (dias) => API.get('/stats/productividad', { params: { dias } })
};

export default API;
