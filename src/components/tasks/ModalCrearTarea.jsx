import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { tareaService, iaService } from '../../services/api.service';

const CATEGORIAS = ['General', 'Trabajo', 'Personal', 'Estudio', 'Proyecto', 'Salud', 'Finanzas', 'Hogar', 'Otro'];

export default function ModalCrearTarea({ show, onHide, onCreada }) {
  const [form, setForm] = useState({
    titulo: '', descripcion: '', prioridad: 'media',
    categoria: 'General', fechaVencimiento: '', etiquetas: ''
  });
  const [cargando, setCargando] = useState(false);
  const [sugirendoDesc, setSugirendoDesc] = useState(false);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onHide();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onHide]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSugerirDesc = async () => {
    if (!form.titulo) return toast.warning('Escribe primero el título');
    setSugirendoDesc(true);
    try {
      const { data } = await iaService.sugerirDescripcion({
        titulo: form.titulo,
        categoria: form.categoria,
        prioridad: form.prioridad
      });
      setForm(f => ({ ...f, descripcion: data.descripcion }));
      toast.success('Descripción generada por IA ✨');
    } catch {
      toast.error('Error al generar descripción');
    } finally {
      setSugirendoDesc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const payload = {
        ...form,
        etiquetas: form.etiquetas
          ? form.etiquetas.split(',').map(t => t.trim()).filter(Boolean)
          : []
      };
      await tareaService.crear(payload);
      toast.success('¡Tarea creada correctamente!');
      setForm({
        titulo: '', descripcion: '', prioridad: 'media',
        categoria: 'General', fechaVencimiento: '', etiquetas: ''
      });
      onCreada();
      onHide();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.error
        || 'Error al crear la tarea';
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onHide}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 1050,
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-crear-tarea-titulo"
        style={{
          position: 'fixed', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1051, padding: '1rem',
          pointerEvents: 'none',
        }}
      >
        <div
          className="modal-content"
          style={{
            width: '100%', maxWidth: 640,
            maxHeight: '90vh', overflowY: 'auto',
            borderRadius: 'var(--st-radius)',
            border: '1px solid var(--st-border)',
            background: 'var(--st-surface)',
            pointerEvents: 'all',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h5
              id="modal-crear-tarea-titulo"
              className="modal-title fw-semibold d-flex align-items-center gap-2"
            >
              <i className="bi bi-plus-circle" style={{ color: 'var(--st-primary)' }} />
              Nueva Tarea
            </h5>
            <button
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={onHide}
            />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* Título */}
              <div className="mb-3">
                <label className="form-label" htmlFor="tarea-titulo">
                  Título <span style={{ color: 'var(--st-danger)' }}>*</span>
                </label>
                <input
                  id="tarea-titulo"
                  type="text"
                  name="titulo"
                  className="form-control"
                  placeholder="¿Qué necesitas hacer?"
                  required minLength={3} maxLength={100}
                  value={form.titulo}
                  onChange={handleChange}
                  autoFocus
                />
              </div>

              {/* Descripción con sugerencia IA */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0" htmlFor="tarea-descripcion">
                    Descripción
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm d-flex align-items-center gap-1"
                    onClick={handleSugerirDesc}
                    disabled={sugirendoDesc}
                    aria-label="Sugerir descripción con IA"
                    style={{
                      background: 'rgba(99,102,241,0.15)',
                      color: 'var(--st-primary)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20,
                    }}
                  >
                    {sugirendoDesc
                      ? <><span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} /> Generando...</>
                      : <><i className="bi bi-magic" /> Sugerir con IA</>
                    }
                  </button>
                </div>
                <textarea
                  id="tarea-descripcion"
                  name="descripcion"
                  className="form-control"
                  rows={3}
                  maxLength={1000}
                  placeholder="Describe la tarea en detalle..."
                  value={form.descripcion}
                  onChange={handleChange}
                />
              </div>

              {/* Prioridad, Categoría, Fecha */}
              <div className="row g-3">
                <div className="col-6 col-md-4">
                  <label className="form-label" htmlFor="tarea-prioridad">
                    Prioridad <span style={{ color: 'var(--st-danger)' }}>*</span>
                  </label>
                  <select
                    id="tarea-prioridad"
                    name="prioridad"
                    className="form-select"
                    value={form.prioridad}
                    onChange={handleChange}
                  >
                    <option value="baja">🟢 Baja</option>
                    <option value="media">🔵 Media</option>
                    <option value="alta">🟡 Alta</option>
                    <option value="urgente">🔴 Urgente</option>
                  </select>
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label" htmlFor="tarea-categoria">Categoría</label>
                  <select
                    id="tarea-categoria"
                    name="categoria"
                    className="form-select"
                    value={form.categoria}
                    onChange={handleChange}
                  >
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="tarea-fecha">
                    Fecha de vencimiento <span style={{ color: 'var(--st-danger)' }}>*</span>
                  </label>
                  <input
                    id="tarea-fecha"
                    type="date"
                    name="fechaVencimiento"
                    className="form-control"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.fechaVencimiento}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Etiquetas */}
              <div className="mt-3">
                <label className="form-label" htmlFor="tarea-etiquetas">
                  Etiquetas{' '}
                  <span style={{ color: 'var(--st-muted)', fontWeight: 400 }}>
                    (separadas por coma)
                  </span>
                </label>
                <input
                  id="tarea-etiquetas"
                  type="text"
                  name="etiquetas"
                  className="form-control"
                  placeholder="ej: react, backend, urgente"
                  value={form.etiquetas}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn"
                onClick={onHide}
                style={{
                  background: 'var(--st-surface2)',
                  color: 'var(--st-muted)',
                  border: '1px solid var(--st-border)',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={cargando}
              >
                {cargando
                  ? <><span className="spinner-border spinner-border-sm" />Creando...</>
                  : <><i className="bi bi-check-lg" />Crear tarea</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
