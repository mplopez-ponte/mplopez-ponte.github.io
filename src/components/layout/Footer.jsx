import React from 'react';

export default function Footer() {
  const año = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--st-surface)',
      borderTop: '1px solid var(--st-border)',
      padding: '1.5rem 1rem', // Responsive base padding
      marginTop: 'auto',
    }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 gap-md-4">

          {/* Izquierda — Logo + licencia */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 26, height: 26, background: 'var(--st-primary)' }}
            >
              <i className="bi bi-lightning-charge-fill text-white" style={{ fontSize: '0.7rem' }} />
            </div>

            <div>
              <span className="fw-semibold d-block d-md-inline" style={{ 
                fontFamily: 'Space Grotesk', 
                fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' 
              }}>
                SmartTask IA
              </span>
              <span className="ia-badge ms-1" style={{ fontSize: '0.6rem' }}>IA</span>
            </div>

            <span
              className="d-inline-flex align-items-center gap-1 badge badge-sm"
              style={{
                fontSize: '0.65rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 20,
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
              title="Licencia MIT"
            >
              <i className="bi bi-shield-check" />
              MIT
            </span>
          </div>

          {/* Centro — Copyright + descripción */}
          <div className="text-center flex-grow-1">
            <p className="mb-1 mb-md-0" style={{ 
              color: 'var(--st-muted)', 
              fontSize: 'clamp(0.7rem, 1.8vw, 0.78rem)',
              lineHeight: 1.4
            }}>
              © {año} SmartTask IA — Plataforma de gestión inteligente de tareas con IA
            </p>
            <p className="mb-0 small d-none d-md-block" style={{ 
              color: 'var(--st-muted)', 
              fontSize: '0.65rem',
              opacity: 0.8
            }}>
              Proyecto Final DAW • Desarrollado con ❤️ React + Node.js + MongoDB
            </p>
          </div>

          {/* Derecha — Stack tecnológico */}
          <div className="d-flex align-items-center gap-1 gap-md-2 flex-wrap">
            {[
              { label: 'React', color: '#61DAFB' },
              { label: 'Node.js', color: '#68A063' },
              { label: 'MongoDB', color: '#47A248' },
              { label: 'OpenAI', color: '#10a37f' },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="badge badge-sm"
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.4rem',
                  borderRadius: 12,
                  background: color + '18',
                  color,
                  border: `1px solid ${color}30`,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap'
                }}
              >
                {label}
              </span>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}