import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Footer from './Footer';

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    cerrarSesion();
    toast.info('Sesión cerrada correctamente');
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard'  },
    { to: '/tareas',    icon: 'bi-check2-square',  label: 'Mis Tareas' },
    { to: '/perfil',    icon: 'bi-person-circle',  label: 'Mi Perfil'  },
  ];

  return (
    <div className="d-flex">

      {/* ── Overlay móvil ─────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="position-fixed w-100 h-100 d-md-none"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 99, top: 0, left: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className={`st-sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="p-4 pb-3 border-bottom" style={{ borderColor: 'var(--st-border)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center pulse-glow"
              style={{ width: 36, height: 36, background: 'var(--st-primary)', fontSize: '1rem' }}
            >
              <i className="bi bi-lightning-charge-fill text-white" />
            </div>
            <div>
              <h6 className="mb-0 fw-bold" style={{ fontFamily: 'Space Grotesk', letterSpacing: '-0.01em' }}>
                SmartTask
              </h6>
              <span className="ia-badge">IA</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-grow-1 p-3">
          <p className="text-uppercase mb-2" style={{ color: 'var(--st-muted)', fontSize: '0.68rem', letterSpacing: '0.1em', fontWeight: 600 }}>
            Navegación
          </p>
          {navLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${icon}`} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Usuario + cerrar sesión */}
        <div className="p-3 border-top" style={{ borderColor: 'var(--st-border)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 34, height: 34, background: 'rgba(99,102,241,0.2)', color: 'var(--st-primary)', fontSize: '0.85rem' }}
            >
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="mb-0 fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>{usuario?.nombre}</p>
              <p className="mb-0 text-truncate" style={{ fontSize: '0.72rem', color: 'var(--st-muted)' }}>{usuario?.email}</p>
            </div>
          </div>
          <button
            className="btn btn-sm w-100 d-flex align-items-center gap-2"
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--st-radius-sm)',
            }}
          >
            <i className="bi bi-box-arrow-right" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ───────────────────────── */}
      {/* d-flex flex-column + min-height 100vh garantiza que el footer
          siempre quede pegado al fondo aunque la página tenga poco contenido */}
      <main className="st-main flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>

        {/* Topbar móvil */}
        <div
          className="d-flex d-md-none align-items-center justify-content-between p-3 border-bottom"
          style={{ background: 'var(--st-surface)', borderColor: 'var(--st-border)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 30, height: 30, background: 'var(--st-primary)' }}
            >
              <i className="bi bi-lightning-charge-fill text-white" style={{ fontSize: '0.85rem' }} />
            </div>
            <span className="fw-bold" style={{ fontFamily: 'Space Grotesk' }}>SmartTask IA</span>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'var(--st-surface2)', color: 'var(--st-text)', border: '1px solid var(--st-border)' }}
          >n
            <i className="bi bi-list fs-5" />
          </button>
        </div>

        {/* Página activa — flex-grow-1 empuja el footer hacia abajo */}
        <div className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </div>
        <Footer />
        </main>
    </div>
  );
}