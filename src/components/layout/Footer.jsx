// Footer.jsx - Footer GLOBAL para TODO el proyecto SmartTask IA
import React from 'react';

export default function Footer() {
  const año = new Date().getFullYear();

  return (
    <footer className="st-footer-global" style={{
      background: 'var(--st-surface)',
      borderTop: '1px solid var(--st-border)',
      padding: '1.5rem 1rem',
      marginTop: 'auto',
      color: 'var(--st-text)',
      fontSize: '0.85rem'
    }}>
      <div className="container">
        <div className="row align-items-center g-3 g-md-4">
          
          {/* Columna 1: Logo + Nombre + MIT */}
          <div className="col-md-4 col-lg-3">
            <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
              <div
                className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 pulse-glow"
                style={{ 
                  width: 32, 
                  height: 32, 
                  background: 'var(--st-primary)' 
                }}
              >
                <i className="bi bi-lightning-charge-fill text-white" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <h6 className="mb-0 fw-bold" style={{ 
                  fontFamily: 'Space Grotesk', 
                  fontSize: '1rem',
                  letterSpacing: '-0.01em'
                }}>
                  SmartTask IA
                </h6>
                <span className="ia-badge" style={{ fontSize: '0.6rem' }}>IA</span>
              </div>
            </div>

            {/* Licencia MIT */}
            <div className="d-flex align-items-center gap-2 mt-2">
              <span 
                className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-semibold"
                style={{
                  fontSize: '0.7rem',
                  background: 'rgba(16,185,129,0.12)',
                  color: '#059669',
                  border: '1px solid rgba(16,185,129,0.25)',
                }}
                title="Licencia MIT - https://www.svgrepo.com/download/444064/legal-license-mit.svg"
              >
                <i className="bi bi-shield-check" style={{ fontSize: '0.65rem' }} />
                MIT
              </span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                © {año}
              </span>
            </div>
          </div>

          {/* Columna 2: Copyright + Descripción */}
          <div className="col-md-4 col-lg-4 text-center text-md-start">
            <p className="mb-1 mb-md-0 small" style={{ 
              color: 'var(--st-muted)', 
              fontSize: '0.8rem',
              lineHeight: 1.4
            }}>
              Plataforma de gestión inteligente de tareas con IA. 
              Proyecto Final DAW.
            </p>
            <p className="mb-0 very-small d-none d-md-block" style={{ 
              color: 'var(--st-muted)', 
              fontSize: '0.65rem',
              opacity: 0.7
            }}>
              Desarrollado con ❤️ React + Node.js + MongoDB + OpenAI
            </p>
          </div>

          {/* Columna 3: Stack + Swagger */}
          <div className="col-md-4 col-lg-5 text-end">
            <div className="d-flex align-items-center justify-content-end justify-content-md-end gap-1 gap-md-2 flex-wrap">
              
              {/* Stack Tecnológico */}
              {[
                { label: 'React', color: '#61DAFB' },
                { label: 'Node.js', color: '#68A063' },
                { label: 'MongoDB', color: '#47A248' },
                { label: 'OpenAI', color: '#10a37f' },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  className="badge-tech px-2 py-1 rounded-pill fw-semibold"
                  style={{
                    fontSize: '0.7rem',
                    background: `${color}18`,
                    color,
                    border: `1px solid ${color}30`,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                </span>
              ))}

              {/* Swagger API Docs */}
              <a
                href="https://smarttask-ia-backend-production.up.railway.app/api/docs/" // Cambia por tu URL de Swagger
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary px-3 py-1 ms-2 d-none d-md-inline-flex align-items-center gap-1 fw-semibold"
                style={{
                  fontSize: '0.75rem',
                  borderRadius: '20px',
                  borderColor: 'var(--st-primary)',
                  color: 'var(--st-primary)'
                }}
              >
                <i className="bi bi-book-code" />
                API Docs
              </a>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .st-footer-global {
          flex-shrink: 0;
        }
        .ia-badge {
          background: var(--st-primary) !important;
          color: white !important;
          padding: 1px 6px !important;
          border-radius: 4px !important;
          font-size: 0.6rem !important;
          font-weight: 600 !important;
        }
        .badge-tech:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        @media (max-width: 768px) {
          .st-footer-global {
            padding: 1rem 0.75rem;
          }
          .badge-tech {
            font-size: 0.65rem !important;
            padding: 0.25rem 0.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
}