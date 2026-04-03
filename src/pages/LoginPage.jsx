import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const data = await iniciarSesion(form.email, form.password);
      toast.success(data.mensaje);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--st-bg)' }}>
      {/* Fondo decorativo */}
      <div className="position-fixed top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="w-100 px-3 fade-in-up" style={{ maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 pulse-glow"
            style={{ width: 56, height: 56, background: 'var(--st-primary)' }}>
            <i className="bi bi-lightning-charge-fill text-white fs-4" />
          </div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: 'Space Grotesk', letterSpacing: '-0.02em' }}>SmartTask IA</h2>
          <p style={{ color: 'var(--st-muted)', fontSize: '0.9rem' }}>Gestión inteligente de tareas</p>
        </div>

        {/* Card */}
        <div className="st-card p-4">
          <h5 className="mb-1 fw-semibold">Iniciar sesión</h5>
          <p className="mb-4" style={{ color: 'var(--st-muted)', fontSize: '0.85rem' }}>Accede a tu espacio de trabajo</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                  <i className="bi bi-envelope" />
                </span>
                <input type="email" className="form-control" placeholder="tu@email.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                  <i className="bi bi-lock" />
                </span>
                <input type="password" className="form-control" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={cargando}>
              {cargando
                ? <><span className="spinner-border spinner-border-sm me-2" />Entrando...</>
                : <><i className="bi bi-box-arrow-in-right me-2" />Entrar</>
              }
            </button>
          </form>
        </div>

        <p className="text-center mt-3" style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="fw-semibold" style={{ color: 'var(--st-primary)', textDecoration: 'none' }}>
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
