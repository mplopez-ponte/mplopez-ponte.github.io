import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TareasPage from './pages/TareasPage';
import TareaDetallePage from './pages/TareaDetallePage';
import PerfilPage from './pages/PerfilPage';
import Layout from './components/layout/Layout';
import Footer from './components/layout/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Ruta protegida
const RutaPrivada = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted">Cargando SmartTask IA...</p>
      </div>
    </div>
  );
  return usuario ? children : <Navigate to="/login" replace />;
};

// Ruta pública (redirige si ya está logueado)
const RutaPublica = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  return !usuario ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<RutaPublica><LoginPage /></RutaPublica>} />
      <Route path="/registro" element={<RutaPublica><RegisterPage /></RutaPublica>} />
      <Route path="/" element={<RutaPrivada><Layout /></RutaPrivada>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tareas" element={<TareasPage />} />
        <Route path="tareas/:id" element={<TareaDetallePage />} />
        <Route path="perfil" element={<PerfilPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Envolvemos todo en un div flex para asegurar que el footer baje */}
        <div className="d-flex flex-column min-vh-100">
          
          <div className="flex-grow-1">
            <AppRoutes />
          </div>

          <Footer /> {/* Se mostrará en todas las páginas */}
          
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}