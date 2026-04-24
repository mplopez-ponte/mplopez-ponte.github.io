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
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="position-fixed w-100 h-100 d-md-none bg-dark bg-opacity-50"
          style={{ zIndex: 1040, top: 0, left: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`st-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{ 
          width: 'var(--st-sidebar-w)', 
          minHeight: '100vh',
          background: 'var(--st-surface)',
          borderRight: '1px solid var(--st-border)',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1041, 
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Logo */}
        <div className="p-4 pb-3 border-bottom" style={{ borderColor: 'var(--st-border)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center pulse-glow"
              style={{ 
                width: 40, 
                height: 40, 
                background: 'var(--st-primary)', 
                fontSize: '1.1rem' 
              }}
            >
              <i className="bi bi-lightning-charge-fill text-white" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ 
                fontFamily: 'Space Grotesk', 
                letterSpacing: '-0.01em' 
              }}>
                SmartTask
              </h5>
              <span className="ia-badge" style={{ fontSize: '0.65rem' }}>IA</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-grow-1 p-4">
          <p 
            className="text-uppercase mb-3" 
            style={{ 
              color: 'var(--st-muted)', 
              fontSize: '0.7rem', 
              letterSpacing: '0.1em', 
              fontWeight: 600 
            }}
          >
            Navegación
          </p>
          {navLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 
                `sidebar-link d-flex align-items-center gap-3 p-3 rounded-2 mb-2 w-100 text-decoration-none transition-all ${
                  isActive ? 'active bg-primary text-white shadow-sm' : 'text-st-muted hover-bg'
                }`
              }
              onClick={() => setSidebarOpen(false)}
              style={{ fontSize: '0.95rem' }}
            >
              <i className={`bi ${icon} fs-5 flex-shrink-0`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Usuario + cerrar sesión */}
        <div className="p-4 border-top" style={{ borderColor: 'var(--st-border)' }}>
          <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3" style={{ 
            background: 'rgba(var(--st-primary-rgb), 0.05)' 
          }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold fs-6"
              style={{ 
                width: 42, 
                height: 42, 
                background: 'rgba(99,102,241,0.15)', 
                color: 'var(--st-primary)' 
              }}
            >
              {(usuario?.nombre?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-grow-1 min-w-0">
              <p className="mb-1 fw-semibold text-truncate" style={{ fontSize: '0.9rem' }}>
                {usuario?.nombre || 'Usuario'}
              </p>
              <p className="mb-0 text-truncate" style={{ 
                fontSize: '0.78rem', 
                color: 'var(--st-muted)' 
              }}>
                {usuario?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          
          <button
            className="btn w-100 d-flex align-items-center gap-2 py-2"
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--st-radius-md)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            <i className="bi bi-box-arrow-right" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column w-100" style={{ marginLeft: '260px' }}>
        {/* Topbar móvil */}
        <header className="d-md-none border-bottom" style={{ 
          background: 'var(--st-surface)', 
          borderColor: 'var(--st-border)' 
        }}>
          <div className="d-flex align-items-center justify-content-between p-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-2 d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36, background: 'var(--st-primary)' }}
              >
                <i 
                  className="bi bi-lightning-charge-fill text-white" 
                  style={{ fontSize: '0.95rem' }} 
                />
              </div>
              <span 
                className="fw-bold" 
                style={{ fontFamily: 'Space Grotesk', fontSize: '1rem' }}
              >
                SmartTask IA
              </span>
            </div>
            <button
              className="btn btn-sm p-2"
              onClick={() => setSidebarOpen(true)}
              style={{ 
                background: 'var(--st-surface2)', 
                color: 'var(--st-text)', 
                border: '1px solid var(--st-border)',
                borderRadius: 'var(--st-radius-sm)'
              }}
            >
              <i className="bi bi-list fs-4" />
            </button>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1 p-4 p-md-5">
            <Outlet />
          </div>
          
        </main>
      </div>

      {/* Estilos inline críticos para sidebar responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          .st-sidebar {
            transform: translateX(-100%) !important;
          }
          .st-sidebar.open {
            transform: translateX(0) !important;
          }
          div[style*="marginLeft: '260px'"] {
            margin-left: 0 !important;
          }
        }
        @media (min-width: 769px) {
          .st-sidebar {
            transform: translateX(0) !important;
            position: relative !important;
          }
        }
      `}</style>
    </div>
  );
}