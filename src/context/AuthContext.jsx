import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('smarttask_token'));

  // Configurar axios con el token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      cargarPerfil();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setCargando(false);
    }
  }, [token]);

  const cargarPerfil = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/perfil`);
      setUsuario(data.usuario);
    } catch {
      cerrarSesion();
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    localStorage.setItem('smarttask_token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const registrar = async (nombre, email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/registro`, { nombre, email, password });
    localStorage.setItem('smarttask_token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const cerrarSesion = () => {
    localStorage.removeItem('smarttask_token');
    setToken(null);
    setUsuario(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const actualizarUsuario = (nuevosDatos) => {
    setUsuario(prev => ({ ...prev, ...nuevosDatos }));
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, token, iniciarSesion, registrar, cerrarSesion, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

const iniciarSesion = async (email, password) => {
  const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
  localStorage.setItem('smarttask_token', data.token);
  setToken(data.token);
  setUsuario(data.usuario);
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  return data;
};

const registrar = async (nombre, email, password) => {
  const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/registro`, { nombre, email, password });
  localStorage.setItem('smarttask_token', data.token);
  setToken(data.token);
  setUsuario(data.usuario);
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  return data;
};
