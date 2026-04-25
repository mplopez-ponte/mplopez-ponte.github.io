import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Footer from './Footer';

/* Root */
const LayoutRoot = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
`;

/* Overlay móvil */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1040;
`;

/* Sidebar */
const Sidebar = styled.aside`
  width: ${props => (props.open ? '250px' : '0')};
  min-height: 100vh;
  background: var(--st-surface);
  border-right: 1px solid var(--st-border);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1041;
  transform: translateX(${props => (props.open ? '0' : '-100%')});
  transition: transform .25s ease-in-out;
  will-change: transform;
  display: flex;
  flex-direction: column;
`;

/* Header/logo area inside sidebar */
const SidebarHeader = styled.div`
  padding: 1rem 1rem 0.75rem 1rem;
  border-bottom: 1px solid transparent;
  border-color: var(--st-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* Logo circle */
const LogoCircle = styled.div`
  width: 40px;
  height: 40px;
  background: var(--st-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1.1rem;
`;

/* Nav */
const Nav = styled.nav`
  padding: 1rem;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

/* Section label */
const SectionLabel = styled.p`
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  color: var(--st-muted);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  font-weight: 600;
`;

/* NavLink styled */
const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  width: 100%;
  text-decoration: none;
  transition: all .12s ease;
  color: var(--st-text);
  font-size: 0.95rem;

  &.active {
    background: var(--st-primary);
    color: white;
    box-shadow: var(--st-shadow-sm);
  }

  &:not(.active):hover {
    background: var(--st-surface2);
  }

  i { flex-shrink: 0; font-size: 1.1rem; }
`;

/* User block and logout area */
const UserBlock = styled.div`
  padding: 1rem;
  border-top: 1px solid transparent;
  border-color: var(--st-border);
`;

const UserCard = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(var(--st-primary-rgb), 0.05);
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(99,102,241,0.15);
  color: var(--st-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

/* Logout button */
const LogoutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(239,68,68,0.1);
  color: #f87171;
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--st-radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
`;

/* Main area that reserves sidebar space on desktop */
const Main = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: ${SIDEBAR_W};
  transition: margin-left .25s ease-in-out;

  @media(max-width: 768px) {
    margin-left: 0;
  }
`;

/* Mobile topbar */
const MobileHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--st-border);
  background: var(--st-surface);
  padding: 0.75rem 1rem;

  @media(min-width: 769px) {
    display: none;
  }
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MobileLogo = styled.div`
  width: 36px;
  height: 36px;
  background: var(--st-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Content wrapper */
const ContentWrap = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

const ContentInner = styled.div`
  flex: 1 1 auto;
  padding: 1rem;
  @media(min-width: 768px) {
    padding: 1.5rem;
  }
`;

/* Utility to ensure responsive media inside content */
const ResponsiveHelpers = styled.div`
  img, table, .card { max-width: 100%; box-sizing: border-box; }
`;

/* Optional: small helper for icons inside links */
const Icon = styled.i`
  font-size: 1.1rem;
`;

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

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { to: '/tareas', icon: 'bi-check2-square', label: 'Mis Tareas' },
    { to: '/perfil', icon: 'bi-person-circle', label: 'Mi Perfil' },
  ];

  return (
    <LayoutRoot>
      <ResponsiveHelpers />

      {sidebarOpen && <Overlay onClick={() => setSidebarOpen(false)} />}

      <Sidebar open={sidebarOpen} aria-hidden={!sidebarOpen && window.innerWidth <= 768}>
        <SidebarHeader>
          <LogoCircle>
            <i className="bi bi-lightning-charge-fill" style={{ color: 'white' }} />
          </LogoCircle>
          <div>
            <h5 style={{ margin: 0, fontFamily: 'Space Grotesk', letterSpacing: '-0.01em' }}>SmartTask</h5>
            <span style={{ fontSize: '0.65rem' }}>IA</span>
          </div>
        </SidebarHeader>

        <Nav>
          <SectionLabel>Navegación</SectionLabel>

          {navLinks.map(({ to, icon, label }) => (
            <StyledNavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className={`bi ${icon}`} />
              <span>{label}</span>
            </StyledNavLink>
          ))}
        </Nav>

        <UserBlock>
          <UserCard>
            <Avatar>{(usuario?.nombre?.[0] || 'U').toUpperCase()}</Avatar>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.nombre || 'Usuario'}
              </p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--st-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.email || 'user@example.com'}
              </p>
            </div>
          </UserCard>

          <LogoutBtn onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" />
            <span>Cerrar sesión</span>
          </LogoutBtn>
        </UserBlock>
      </Sidebar>

      <Main>
        <MobileHeader>
          <TopLeft>
            <MobileLogo>
              <i className="bi bi-lightning-charge-fill" style={{ color: 'white', fontSize: '0.95rem' }} />
            </MobileLogo>
            <span style={{ fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '1rem' }}>SmartTask IA</span>
          </TopLeft>

          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'var(--st-surface2)',
              color: 'var(--st-text)',
              border: '1px solid var(--st-border)',
              borderRadius: 'var(--st-radius-sm)',
              padding: '0.35rem 0.5rem',
              cursor: 'pointer'
            }}
            aria-label="Abrir menú"
          >
            <i className="bi bi-list" style={{ fontSize: '1.1rem' }} />
          </button>
        </MobileHeader>

        <ContentWrap>
          <ContentInner>
            <Outlet />
          </ContentInner>

          <Footer />
        </ContentWrap>
      </Main>
    </LayoutRoot>
  );
}