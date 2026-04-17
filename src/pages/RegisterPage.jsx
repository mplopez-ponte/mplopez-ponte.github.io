import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [cargando, setCargando] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmar) {
      return toast.error('Las contraseñas no coinciden');
    }
    if (form.password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }
    setCargando(true);
    try {
      const data = await registrar(form.nombre, form.email, form.password);
      toast.success(data.mensaje);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--st-bg)' }}>
      <div className="position-fixed top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="w-100 px-3 fade-in-up" style={{ maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
            style={{ width: 56, height: 56, background: 'var(--st-primary)' }}>
            <i className="bi bi-lightning-charge-fill text-white fs-4" />
          </div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: 'Space Grotesk', letterSpacing: '-0.02em' }}>Crear cuenta</h2>
          <p style={{ color: 'var(--st-muted)', fontSize: '0.9rem' }}>Empieza a gestionar tus tareas con IA</p>
        </div>

        <div className="st-card p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                  <i className="bi bi-person" />
                </span>
                <input type="text" className="form-control" placeholder="Tu nombre" required minLength={2}
                  value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
            </div>

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

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                  <i className="bi bi-lock" />
                </span>
                <input type="password" className="form-control" placeholder="Mínimo 6 caracteres" required minLength={6}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Confirmar contraseña</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                  <i className="bi bi-shield-lock" />
                </span>
                <input type="password" className="form-control" placeholder="Repite la contraseña" required
                  value={form.confirmar} onChange={e => setForm({ ...form, confirmar: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={cargando}>
              {cargando
                ? <><span className="spinner-border spinner-border-sm me-2" />Creando cuenta...</>
                : <><i className="bi bi-person-plus me-2" />Crear cuenta gratis</>
              }
            </button>
          </form>
        </div>

        <p className="text-center mt-3" style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="fw-semibold" style={{ color: 'var(--st-primary)', textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
