import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { tareaService, iaService } from '../../services/api.service';

const CATEGORIAS = ['General', 'Trabajo', 'Personal', 'Estudio', 'Proyecto', 'Salud', 'Finanzas', 'Hogar', 'Otro'];

export default function ModalCrearTarea({ show, onHide, onCreada }) {
  const [form, setForm] = useState({
    titulo: '', descripcion: '', prioridad: 'media', categoria: 'General',
    fechaVencimiento: '', etiquetas: ''
  });
  const [cargando, setCargando] = useState(false);
  const [sugirendoDesc, setSugirendoDesc] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSugerirDesc = async () => {
    if (!form.titulo) return toast.warning('Escribe primero el título');
    setSugirendoDesc(true);
    try {
      const { data } = await iaService.sugerirDescripcion({ titulo: form.titulo, categoria: form.categoria, prioridad: form.prioridad });
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
        etiquetas: form.etiquetas ? form.etiquetas.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      await tareaService.crear(payload);
      toast.success('¡Tarea creada correctamente!');
      setForm({ titulo: '', descripcion: '', prioridad: 'media', categoria: 'General', fechaVencimiento: '', etiquetas: '' });
      onCreada();
      onHide();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al crear la tarea';
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-semibold d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle" style={{ color: 'var(--st-primary)' }} />
              Nueva Tarea
            </h5>
            <button className="btn-close btn-close-white" onClick={onHide} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Título */}
              <div className="mb-3">
                <label className="form-label">Título <span style={{ color: 'var(--st-danger)' }}>*</span></label>
                <input type="text" name="titulo" className="form-control" placeholder="¿Qué necesitas hacer?"
                  required minLength={3} maxLength={100} value={form.titulo} onChange={handleChange} />
              </div>

              {/* Descripción con IA */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0">Descripción</label>
                  <button type="button" className="btn btn-sm d-flex align-items-center gap-1"
                    onClick={handleSugerirDesc} disabled={sugirendoDesc}
                    style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--st-primary)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20 }}>
                    {sugirendoDesc
                      ? <><span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} /> Generando...</>
                      : <><i className="bi bi-magic" /> Sugerir con IA</>
                    }
                  </button>
                </div>
                <textarea name="descripcion" className="form-control" rows={3} maxLength={1000}
                  placeholder="Describe la tarea en detalle..." value={form.descripcion} onChange={handleChange} />
              </div>

              <div className="row g-3">
                {/* Prioridad */}
                <div className="col-6 col-md-4">
                  <label className="form-label">Prioridad <span style={{ color: 'var(--st-danger)' }}>*</span></label>
                  <select name="prioridad" className="form-select" value={form.prioridad} onChange={handleChange}>
                    <option value="baja">🟢 Baja</option>
                    <option value="media">🔵 Media</option>
                    <option value="alta">🟡 Alta</option>
                    <option value="urgente">🔴 Urgente</option>
                  </select>
                </div>

                {/* Categoría */}
                <div className="col-6 col-md-4">
                  <label className="form-label">Categoría</label>
                  <select name="categoria" className="form-select" value={form.categoria} onChange={handleChange}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Fecha */}
                <div className="col-12 col-md-4">
                  <label className="form-label">Fecha de vencimiento <span style={{ color: 'var(--st-danger)' }}>*</span></label>
                  <input type="date" name="fechaVencimiento" className="form-control" required
                    min={new Date().toISOString().split('T')[0]} value={form.fechaVencimiento} onChange={handleChange} />
                </div>
              </div>

              {/* Etiquetas */}
              <div className="mt-3">
                <label className="form-label">Etiquetas <span style={{ color: 'var(--st-muted)', fontWeight: 400 }}>(separadas por coma)</span></label>
                <input type="text" name="etiquetas" className="form-control" placeholder="ej: react, backend, urgente"
                  value={form.etiquetas} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn" onClick={onHide}
                style={{ background: 'var(--st-surface2)', color: 'var(--st-muted)', border: '1px solid var(--st-border)' }}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={cargando}>
                {cargando
                  ? <><span className="spinner-border spinner-border-sm" />Creando...</>
                  : <><i className="bi bi-check-lg" />Crear tarea</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
