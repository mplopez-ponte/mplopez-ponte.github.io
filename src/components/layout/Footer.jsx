// Footer.jsx - LOGO MIT PEQUEÑO Y PERFECTAMENTE RESPONSIVO
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
          
          {/* Columna 1: Logo SmartTask + MIT PEQUEÑO */}
          <div className="col-md-4 col-lg-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              {/* Logo SmartTask */}
              <div
                className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ 
                  width: 28, 
                  height: 28, 
                  background: 'var(--st-primary)' 
                }}
              >
                <i className="bi bi-lightning-charge-fill text-white" style={{ fontSize: '0.7rem' }} />
              </div>
              <div>
                <h6 className="mb-0 fw-bold" style={{ 
                  fontFamily: 'Space Grotesk', 
                  fontSize: '0.95rem',
                  letterSpacing: '-0.01em'
                }}>
                  SmartTask IA
                </h6>
                <span className="ia-badge" style={{ fontSize: '0.55rem' }}>IA</span>
              </div>
            </div>

            {/* LOGO MIT MUY PEQUEÑO - RESPONSIVO */}
            <div className="d-flex align-items-center gap-1 gap-md-2 flex-wrap">
              {/* SVG MIT OPTIMIZADO para tamaño PEQUEÑO */}
              <svg 
                className="mit-logo-tiny"
                width="16"
                height="8"
                viewBox="0 0 321 166"
                fill="none"
                style={{ 
                  flexShrink: 0,
                  filter: 'brightness(0) saturate(100%) invert(28%) sepia(68%) saturate(6200%) hue-rotate(246deg) brightness(92%) contrast(106%)'
                }}
                title="MIT License"
              >
                {/* M roja - simplificado para pequeño tamaño */}
                <rect x="0" y="0" width="107" height="166" fill="#A31F34" rx="0.5"/>
                {/* I gris */}
                <rect x="107" y="166" width="53" height="83" fill="#666666" rx="0.5" transform="rotate(-90 107 166)"/>
                {/* T roja */}
                <rect x="160" y="0" width="161" height="166" fill="#A31F34" rx="0.5"/>
              </svg>

              {/* Badge MIT + Copyright */}
              <span 
                className="d-inline-flex align-items-center gap-1 px-1 py-0.5 rounded-pill fw-semibold me-1"
                style={{
                  fontSize: '0.65rem',
                  background: 'rgba(16,185,129,0.12)',
                  color: '#059669',
                  border: '1px solid rgba(16,185,129,0.25)',
                  lineHeight: 1
                }}
              >
                <i className="bi bi-shield-check" style={{ fontSize: '0.55rem' }} />
                MIT
              </span>
              <small className="text-muted fw-normal" style={{ 
                fontSize: '0.65rem',
                lineHeight: 1
              }}>
                {año}
              </small>
            </div>
          </div>

          {/* Columna 2: Descripción */}
          <div className="col-md-4 col-lg-4 text-center text-md-start">
            <p className="mb-1 mb-md-0 small lh-sm" style={{ 
              color: 'var(--st-muted)', 
              fontSize: '0.78rem',
              lineHeight: 1.3
            }}>
              Gestión inteligente de tareas con IA
            </p>
            <p className="mb-0 d-none d-md-block" style={{ 
              color: 'var(--st-muted)', 
              fontSize: '0.62rem',
              opacity: 0.7
            }}>
              Proyecto Final DAW • React + Node.js Express + MongoDB
              Autor: María Paz López Ponte
            </p>
          </div>

          {/* Columna 3: Stack + Swagger */}
          <div className="col-md-4 col-lg-5 text-end">
            <div className="d-flex align-items-center justify-content-end gap-1 flex-wrap">
              
              {/* Stack RESPONSIVO PEQUEÑO */}
              {[
                { label: 'React', color: '#61DAFB' },
                { label: 'Node + Express', color: '#68A063' },
                { label: 'Mongo', color: '#47A248' },
                { label: 'OpenAI', color: '#10a37f' },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  className="badge-tech px-1 py-0.5 rounded-pill fw-semibold"
                  style={{
                    fontSize: '0.62rem',
                    background: `${color}18`,
                    color,
                    border: `1px solid ${color}30`,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}
                  title={`${label} Technology`}
                >
                  {label}
                </span>
              ))}

              {/* API Docs */}
              <a
                href="https://smarttask-ia-backend-production.up.railway.app/api/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs ms-1 px-2 py-0.5 d-none d-md-inline-flex align-items-center gap-1 fw-semibold"
                style={{
                  fontSize: '0.65rem',
                  borderRadius: '12px',
                  border: '1px solid var(--st-primary)',
                  color: 'var(--st-primary)',
                  background: 'transparent',
                  textDecoration: 'none',
                  lineHeight: 1
                }}
              >
                <i className="bi bi-book-code" style={{ fontSize: '0.65rem' }} />
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
          padding: 1px 4px !important;
          border-radius: 3px !important;
          font-size: 0.55rem !important;
          font-weight: 600 !important;
          line-height: 1 !important;
        }
        .mit-logo-tiny {
          transition: transform 0.2s ease;
        }
        .mit-logo-tiny:hover {
          transform: scale(1.15);
        }
        .badge-tech:hover {
          transform: translateY(-0.5px);
        }
        @media (max-width: 576px) {
          .st-footer-global {
            padding: 0.75rem 0.5rem;
          }
          .mit-logo-tiny {
            width: 14px !important;
            height: 7px !important;
          }
        }
        @media (max-width: 768px) and (min-width: 577px) {
          .mit-logo-tiny {
            width: 15px !important;
            height: 7.5px !important;
          }
        }
      `}</style>
    </footer>
  );
}