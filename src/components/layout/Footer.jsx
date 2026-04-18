import React from 'react';

export default function Footer() {
  const año = new Date().getFullYear();

  // URL de Swagger — cambiar por la URL real de Railway
  const SWAGGER_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '/api/docs')
    : 'http://localhost:5000/api/docs';

  return (
    <footer style={{
      background: 'var(--st-surface)',
      borderTop: '1px solid var(--st-border)',
      padding: '28px 32px 20px',
      marginTop: 'auto',
    }}>
      {/* Fila principal */}
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-4 mb-4">

        {/* Columna 1 — Logo + descripción */}
        <div style={{ minWidth: 180 }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 28, height: 28, background: 'var(--st-primary)' }}
            >
              <i className="bi bi-lightning-charge-fill text-white" style={{ fontSize: '0.75rem' }} />
            </div>
            <span className="fw-bold" style={{ fontFamily: 'Space Grotesk', fontSize: '0.95rem' }}>
              SmartTask IA
            </span>
            <span className="ia-badge" style={{ fontSize: '0.6rem' }}>IA</span>
          </div>
          <p style={{ color: 'var(--st-muted)', fontSize: '0.78rem', lineHeight: 1.6, maxWidth: 200 }}>
            Gestor de tareas inteligente con IA para organizar tu día a día de forma eficiente y sencilla.
          </p>
        </div>

        <div>
          <img src="https://icon-icons.com/icon/legal-license-mit/157533" alt="MIT License" style={{ width: 48, opacity: 0.6 }} />
        </div>

        {/* Columna 2 — Stack tecnológico */}
        <div style={{ minWidth: 140 }}>
          <p className="mb-2 fw-semibold" style={{ fontSize: '0.78rem', color: 'var(--st-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Tecnologías
          </p>
          <div className="d-flex flex-wrap gap-2">
            {[
              { label: 'React',    color: '#61DAFB' },
              { label: 'Node.js',  color: '#68A063' },
              { label: 'MongoDB',  color: '#47A248' },
              { label: 'OpenAI',   color: '#10a37f' },
              { label: 'Vite',     color: '#BD34FE' },
              { label: 'Bootstrap',color: '#7952B3' },
            ].map(({ label, color }) => (
              <span key={label} style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 20,
                background: color + '18',
                color,
                border: `1px solid ${color}30`,
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Columna 3 — Documentación Swagger */}
        <div style={{ minWidth: 180 }}>
          <p className="mb-2 fw-semibold" style={{ fontSize: '0.78rem', color: 'var(--st-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Documentación API
          </p>

          <a
            href={SWAGGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center gap-2 text-decoration-none mb-2"
            style={{
              background: 'rgba(133,230,70,0.08)',
              border: '1px solid rgba(133,230,70,0.25)',
              borderRadius: 'var(--st-radius-sm)',
              padding: '8px 14px',
              transition: 'all 0.2s',
              width: 'fit-content',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(133,230,70,0.15)';
              e.currentTarget.style.borderColor = 'rgba(133,230,70,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(133,230,70,0.08)';
              e.currentTarget.style.borderColor = 'rgba(133,230,70,0.25)';
            }}
          >
            {/* Logo Swagger SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Swagger"
            >
              <rect width="512" height="512" rx="88" fill="#85E646"/>
              <path
                fill="#1A1A1A"
                d="M256 94c-89.4 0-162 72.6-162 162s72.6 162 162 162 162-72.6 162-162S345.4 94 256 94zm0 298c-74.9 0-136-61.1-136-136S181.1 120 256 120s136 61.1 136 136-61.1 136-136 136z"
              />
              <path
                fill="#1A1A1A"
                d="M241.7 240.4c-9.5-2.5-15.8-4.9-18.9-7.2-3-2.3-4.5-5.4-4.5-9.3 0-4.3 1.9-7.8 5.6-10.5 3.8-2.7 8.8-4 15.1-4 6.6 0 11.8 1.6 15.5 4.7 3.7 3.1 5.7 7.5 5.9 13.1h18.8c-.2-10.4-3.7-18.5-10.6-24.3-6.8-5.8-16.2-8.8-28.1-8.8-11.4 0-20.7 3-27.8 8.9-7.1 5.9-10.7 13.6-10.7 23 0 9.1 3.1 16.3 9.4 21.5 6.2 5.2 16.1 9.3 29.7 12.4 9.8 2.4 16.4 5.1 19.7 8.1 3.3 3 5 7 5 12 0 4.8-2 8.7-6.1 11.6-4 2.9-9.5 4.4-16.3 4.4-7.2 0-13.1-1.8-17.5-5.5-4.4-3.7-6.8-8.9-7.1-15.6h-18.9c.2 11.5 4.2 20.4 12 26.8 7.8 6.4 18.4 9.5 31.7 9.5 12.2 0 21.9-3 29.2-9.1 7.3-6.1 10.9-14.1 10.9-24.1 0-9.9-3.2-17.5-9.5-22.9-6.3-5.3-16.5-9.5-30.5-12.7z"
              />
            </svg>
            <div>
              <p className="mb-0 fw-semibold" style={{ fontSize: '0.8rem', color: '#85E646' }}>
                Swagger UI
              </p>
              <p className="mb-0" style={{ fontSize: '0.7rem', color: 'var(--st-muted)' }}>
                Ver documentación API
              </p>
            </div>
            <i className="bi bi-box-arrow-up-right ms-1" style={{ color: 'var(--st-muted)', fontSize: '0.7rem' }} />
          </a>

          <p style={{ color: 'var(--st-muted)', fontSize: '0.72rem', marginTop: 6 }}>
            OpenAPI 3.0 · 21 endpoints documentados
          </p>

        </div>

      </div>

      {/* Línea divisoria */}
      <div style={{ borderTop: '1px solid var(--st-border)', paddingTop: 16 }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <p className="mb-0" style={{ color: 'var(--st-muted)', fontSize: '0.75rem' }}>
            © {año} SmartTask IA — Proyecto Final CFGS Desarrollo de Aplicaciones Web
          </p>
          <p className="mb-0 d-flex align-items-center gap-1" style={{ color: 'var(--st-muted)', fontSize: '0.75rem' }}>
            Desarrollado con
            <i className="bi bi-heart-fill" style={{ color: '#ef4444', fontSize: '0.65rem' }} />
            React + Node.js
          </p>
        </div>
      </div>

    </footer>
  );
}
