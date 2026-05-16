import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { tareaService, iaService } from '../../services/api.service';

const CATEGORIAS = ['General','Trabajo','Personal','Estudio','Proyecto','Salud','Finanzas','Hogar','Otro'];

export default function ModalCrearTarea({ show, onHide, onCreada }) {
  const [form, setForm] = useState({
    titulo: '', descripcion: '', prioridad: 'media',
    categoria: 'General', fechaVencimiento: '', etiquetas: ''
  });
  const [cargando, setCargando] = useState(false);
  const [sugirendoDesc, setSugirendoDesc] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () =>
    setForm({ titulo: '', descripcion: '', prioridad: 'media', categoria: 'General', fechaVencimiento: '', etiquetas: '' });

  /* ── IA: sugiere descripción → POST /ai/sugerir-descripcion ── */
  const handleSugerirDesc = async () => {
    if (!form.titulo.trim()) return toast.warning('Escribe primero el título');
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
      resetForm();
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

  const handleClose = () => { resetForm(); onHide(); };

  if (!show) return null;

  return (
    /* Backdrop */
    <div
      className="modal show d-block"
      style={{ background: 'rgba(0,0,0,0.65)', zIndex: 1050, overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Dialog — ocupa pantalla completa en móvil, centrado en tablet/desktop */}
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
        style={{ margin: '0.5rem auto', maxWidth: 'min(720px, calc(100vw - 1rem))' }}
      >
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title fw-semibold d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle" style={{ color: 'var(--st-primary)' }} />
              Nueva Tarea
            </h5>
            <button className="btn-close btn-close-white" onClick={handleClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* Título */}
              <div className="mb-3">
                <label className="form-label">
                  Título <span style={{ color: 'var(--st-danger)' }}>*</span>
                </label>
                <input
                  type="text" name="titulo" className="form-control"
                  placeholder="¿Qué necesitas hacer?"
                  required minLength={3} maxLength={100}
                  value={form.titulo} onChange={handleChange}
                />
              </div>

              {/* Descripción + botón IA */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1 gap-2 flex-wrap">
                  <label className="form-label mb-0">Descripción</label>

                  {/* Botón IA → llama a iaService.sugerirDescripcion */}
                  <button
                    type="button"
                    className="btn btn-sm d-flex align-items-center gap-1 flex-shrink-0"
                    onClick={handleSugerirDesc}
                    disabled={sugirendoDesc}
                    title="Genera una descripción con IA basada en el título, categoría y prioridad"
                    style={{
                      background: 'rgba(99,102,241,0.15)',
                      color: 'var(--st-primary)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      fontSize: '0.78rem',
                      padding: '4px 12px',
                      borderRadius: 20,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {sugirendoDesc
                      ? <><span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} /> Generando...</>
                      : <><i className="bi bi-magic" /> Sugerir con IA</>
                    }
                  </button>
                </div>
                <textarea
                  name="descripcion" className="form-control" rows={3} maxLength={1000}
                  placeholder="Describe la tarea en detalle... o deja que la IA lo haga por ti"
                  value={form.descripcion} onChange={handleChange}
                />
              </div>

              {/* Prioridad · Categoría · Fecha — responsivo */}
              <div className="row g-3 mb-3">
                <div className="col-6 col-md-4">
                  <label className="form-label">
                    Prioridad <span style={{ color: 'var(--st-danger)' }}>*</span>
                  </label>
                  <select name="prioridad" className="form-select" value={form.prioridad} onChange={handleChange}>
                    <option value="baja">🟢 Baja</option>
                    <option value="media">🔵 Media</option>
                    <option value="alta">🟡 Alta</option>
                    <option value="urgente">🔴 Urgente</option>
                  </select>
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label">Categoría</label>
                  <select name="categoria" className="form-select" value={form.categoria} onChange={handleChange}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">
                    Vencimiento <span style={{ color: 'var(--st-danger)' }}>*</span>
                  </label>
                  <input
                    type="date" name="fechaVencimiento" className="form-control" required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.fechaVencimiento} onChange={handleChange}
                  />
                </div>
              </div>

              {/* Etiquetas */}
              <div>
                <label className="form-label">
                  Etiquetas{' '}
                  <span style={{ color: 'var(--st-muted)', fontWeight: 400, fontSize: '0.8rem' }}>
                    (separadas por coma)
                  </span>
                </label>
                <input
                  type="text" name="etiquetas" className="form-control"
                  placeholder="ej: react, backend, urgente"
                  value={form.etiquetas} onChange={handleChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer flex-nowrap gap-2">
              <button
                type="button" className="btn flex-fill"
                onClick={handleClose}
                style={{
                  background: 'var(--st-surface2)',
                  color: 'var(--st-muted)',
                  border: '1px solid var(--st-border)'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                disabled={cargando}
              >
                {cargando
                  ? <><span className="spinner-border spinner-border-sm" /> Creando...</>
                  : <><i className="bi bi-check-lg" /> Crear tarea</>
                }
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
