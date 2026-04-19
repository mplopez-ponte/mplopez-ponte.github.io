import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Footer from './Footer';

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      toast.info('Sesión cerrada correctamente');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  // Cierra sidebar al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { to: '/tareas', icon: 'bi-check2-square', label: 'Mis Tareas' },
    { to: '/perfil', icon: 'bi-person-circle', label: 'Mi Perfil' },
  ];

  return (
    <footer style={{
      background: 'var(--st-surface)',
      borderTop: '1px solid var(--st-border)',
      padding: '20px 32px',
      marginTop: 'auto',
    }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

        {/* Izquierda — Logo */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 26, height: 26, background: 'var(--st-primary)' }}
          >
            <i className="bi bi-lightning-charge-fill text-white" style={{ fontSize: '0.7rem' }} />
          </div>
        </div>

        {/* Centro — Copyright */}
        <p className="mb-0 text-center" style={{ color: 'var(--st-muted)', fontSize: '0.78rem' }}>
          © {año} SmartTask IA — Proyecto Final DAW
          <span className="mx-2" style={{ color: 'var(--st-border)' }}>·</span>
          Desarrollado con
          <i className="bi bi-heart-fill mx-1" style={{ color: '#ef4444', fontSize: '0.7rem' }} />
          React + Node.js
        </p>

        {/* Derecha — Stack tecnológico */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {[
            { label: 'React',   color: '#61DAFB' },
            { label: 'Node.js', color: '#68A063' },
            { label: 'MongoDB', color: '#47A248' },
            { label: 'OpenAI',  color: '#10a37f' },
          ].map(({ label, color }) => (
            <span key={label} style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 20,
              background: color + '18',
              color,
              border: `1px solid ${color}30`,
              letterSpacing: '0.02em',
            }}>
              {label}
            </span>
          ))}
        </div>

      </div>
    </footer>
  );
}
