import React from 'react';

export default function Footer() {
  const año = new Date().getFullYear();

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
          <span className="fw-semibold" style={{ fontFamily: 'Space Grotesk', fontSize: '0.875rem' }}>
            SmartTask IA
          </span>
          <span className="ia-badge" style={{ fontSize: '0.6rem' }}>IA</span>
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
/* footer fix */
