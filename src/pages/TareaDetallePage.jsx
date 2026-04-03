import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tareaService, iaService } from '../services/api.service';

const ESTADOS = ['pendiente', 'en_progreso', 'completada', 'cancelada'];
const ESTADO_LABELS = { pendiente: 'Pendiente', en_progreso: 'En Progreso', completada: 'Completada', cancelada: 'Cancelada' };

export default function TareaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarea, setTarea] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [consejoIA, setConsejoIA] = useState('');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { cargarTarea(); }, [id]);

  const cargarTarea = async () => {
    try {
      const { data } = await tareaService.obtener(id);
      setTarea(data.tarea);
      setForm({
        titulo: data.tarea.titulo,
        descripcion: data.tarea.descripcion || '',
        prioridad: data.tarea.prioridad,
        categoria: data.tarea.categoria,
        fechaVencimiento: data.tarea.fechaVencimiento?.split('T')[0]
      });
    } catch {
      toast.error('Tarea no encontrada');
      navigate('/tareas');
    } finally {
      setCargando(false);
    }
  };

  const handleToggleSubtarea = async (subtareaId) => {
    try {
      const { data } = await tareaService.toggleSubtarea(id, subtareaId);
      setTarea(data.tarea);
    } catch { toast.error('Error al actualizar subtarea'); }
  };

  const handleCambiarEstado = async (estado) => {
    try {
      const { data } = await tareaService.cambiarEstado(id, estado);
      setTarea(data.tarea);
      toast.success(`Estado: ${ESTADO_LABELS[estado]}`);
    } catch { toast.error('Error al cambiar estado'); }
  };

  const handleGenerarSubtareas = async () => {
    if (tarea.subtareas?.length > 0) {
      if (!window.confirm('Esto reemplazará las subtareas actuales. ¿Continuar?')) return;
    }
    setGenerandoIA(true);
    try {
      const { data } = await iaService.generarSubtareas(id);
      setTarea(prev => ({ ...prev, subtareas: data.subtareas, subtareasGeneradasPorIA: true }));
      setConsejoIA(data.consejo);
      toast.success(`✨ ${data.subtareas.length} subtareas generadas por IA`);
    } catch { toast.error('Error al generar subtareas con IA'); }
    finally { setGenerandoIA(false); }
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const { data } = await tareaService.actualizar(id, form);
      setTarea(data.tarea);
      setEditando(false);
      toast.success('Tarea actualizada');
    } catch { toast.error('Error al actualizar'); }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar esta tarea? Esta acción no se puede deshacer.')) return;
    try {
      await tareaService.eliminar(id);
      toast.success('Tarea eliminada');
      navigate('/tareas');
    } catch { toast.error('Error al eliminar'); }
  };

  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const getDiasRestantes = (fecha) => {
    const dias = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return { label: `Venció hace ${Math.abs(dias)} días`, color: '#ef4444' };
    if (dias === 0) return { label: 'Vence hoy', color: '#f59e0b' };
    return { label: `${dias} días restantes`, color: dias <= 3 ? '#f59e0b' : '#10b981' };
  };

  if (cargando) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
      <div className="spinner-border text-primary" style={{ width: '2.5rem', height: '2.5rem' }} />
    </div>
  );

  if (!tarea) return null;

  const dr = getDiasRestantes(tarea.fechaVencimiento);
  const subtareasCompletadas = tarea.subtareas?.filter(s => s.completada).length || 0;

  return (
    <div className="fade-in-up">
      {/* Breadcrumb */}
      <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.85rem', color: 'var(--st-muted)' }}>
        <button className="btn btn-sm p-0 d-flex align-items-center gap-1" onClick={() => navigate('/tareas')}
          style={{ background: 'none', border: 'none', color: 'var(--st-muted)' }}>
          <i className="bi bi-arrow-left" /> Mis Tareas
        </button>
        <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }} />
        <span className="text-truncate" style={{ color: 'var(--st-text)', maxWidth: 300 }}>{tarea.titulo}</span>
      </div>

      <div className="row g-4">
        {/* Columna principal */}
        <div className="col-lg-8">

          {/* Header tarea */}
          <div className="st-card p-4 mb-3">
            {editando ? (
              <form onSubmit={handleGuardarEdicion}>
                <input type="text" className="form-control mb-3 fs-5 fw-bold" name="titulo"
                  value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required />
                <textarea className="form-control mb-3" rows={3} name="descripcion"
                  value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Descripción..." />
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <select className="form-select" value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })}>
                      {['baja','media','alta','urgente'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="col-4">
                    <input type="text" className="form-control" placeholder="Categoría" value={form.categoria}
                      onChange={e => setForm({ ...form, categoria: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <input type="date" className="form-control" value={form.fechaVencimiento}
                      onChange={e => setForm({ ...form, fechaVencimiento: e.target.value })} />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary btn-sm"><i className="bi bi-check-lg me-1" />Guardar</button>
                  <button type="button" className="btn btn-sm" onClick={() => setEditando(false)}
                    style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                  <h4 className="fw-bold mb-0">{tarea.titulo}</h4>
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button className="btn btn-sm" onClick={() => setEditando(true)} title="Editar"
                      style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                      <i className="bi bi-pencil" />
                    </button>
                    <button className="btn btn-sm" onClick={handleEliminar} title="Eliminar"
                      style={{ background: 'transparent', border: '1px solid var(--st-border)', color: '#f87171' }}>
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-2 flex-wrap mb-3">
                  <span className={`badge-prioridad badge-${tarea.prioridad}`}>{tarea.prioridad}</span>
                  <span className={`badge-prioridad badge-${tarea.estado}`}>{ESTADO_LABELS[tarea.estado]}</span>
                  {tarea.subtareasGeneradasPorIA && <span className="ia-badge">Subtareas IA</span>}
                  {tarea.categoria && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--st-muted)', background: 'var(--st-surface2)', padding: '2px 10px', borderRadius: 20, border: '1px solid var(--st-border)' }}>
                      <i className="bi bi-tag me-1" />{tarea.categoria}
                    </span>
                  )}
                </div>

                {tarea.descripcion && (
                  <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.9rem' }}>{tarea.descripcion}</p>
                )}

                {/* Etiquetas */}
                {tarea.etiquetas?.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {tarea.etiquetas.map((et, i) => (
                      <span key={i} style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.12)', color: 'var(--st-primary)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '2px 10px' }}>
                        #{et}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Subtareas */}
          <div className="st-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0 fw-semibold">
                  <i className="bi bi-list-check me-2" style={{ color: 'var(--st-primary)' }} />
                  Subtareas
                </h6>
                {tarea.subtareas?.length > 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--st-muted)' }}>
                    {subtareasCompletadas}/{tarea.subtareas.length}
                  </span>
                )}
              </div>
              <button className="btn btn-sm d-flex align-items-center gap-2" onClick={handleGenerarSubtareas} disabled={generandoIA}
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.15))', color: 'var(--st-secondary)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 20, fontWeight: 600, fontSize: '0.8rem' }}>
                {generandoIA
                  ? <><span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} />Generando con IA...</>
                  : <><i className="bi bi-stars" />Generar con IA</>
                }
              </button>
            </div>

            {/* Barra progreso */}
            {tarea.subtareas?.length > 0 && (
              <div className="mb-3">
                <div className="progress" style={{ height: 8 }}>
                  <div className="progress-bar" style={{ width: `${tarea.progreso}%`, background: 'var(--st-primary)', transition: 'width 0.5s' }} />
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small style={{ color: 'var(--st-muted)', fontSize: '0.75rem' }}>Progreso</small>
                  <small style={{ color: 'var(--st-primary)', fontSize: '0.75rem', fontWeight: 600 }}>{tarea.progreso}%</small>
                </div>
              </div>
            )}

            {/* Lista de subtareas */}
            {tarea.subtareas?.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {tarea.subtareas.sort((a, b) => a.orden - b.orden).map(sub => (
                  <div key={sub._id} className="d-flex align-items-start gap-3 p-3 rounded-2"
                    style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)' }}>
                    <input type="checkbox" checked={sub.completada} onChange={() => handleToggleSubtarea(sub._id)}
                      style={{ width: 18, height: 18, marginTop: 2, cursor: 'pointer', accentColor: 'var(--st-primary)', flexShrink: 0 }} />
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-medium" style={{
                        fontSize: '0.875rem',
                        color: sub.completada ? 'var(--st-muted)' : 'var(--st-text)',
                        textDecoration: sub.completada ? 'line-through' : 'none'
                      }}>
                        {sub.titulo}
                      </p>
                      {sub.descripcion && (
                        <p className="mb-0 mt-1" style={{ fontSize: '0.78rem', color: 'var(--st-muted)', lineHeight: 1.5 }}>
                          {sub.descripcion}
                        </p>
                      )}
                    </div>
                    {sub.completada && (
                      <i className="bi bi-check-circle-fill flex-shrink-0" style={{ color: '#10b981', fontSize: '1rem' }} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-stars display-5 d-block mb-2" style={{ color: 'var(--st-muted)', opacity: 0.5 }} />
                <p style={{ color: 'var(--st-muted)', fontSize: '0.875rem', marginBottom: 4 }}>Sin subtareas todavía</p>
                <p style={{ color: 'var(--st-muted)', fontSize: '0.8rem' }}>
                  Usa la IA para generar subtareas inteligentes basadas en la prioridad y fecha de vencimiento
                </p>
              </div>
            )}

            {/* Consejo IA */}
            {consejoIA && (
              <div className="mt-3 p-3 rounded-2" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
                <div className="d-flex gap-2 align-items-start">
                  <i className="bi bi-lightbulb-fill flex-shrink-0 mt-1" style={{ color: 'var(--st-secondary)' }} />
                  <div>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '0.8rem', color: 'var(--st-secondary)' }}>Consejo de la IA</p>
                    <p className="mb-0" style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>{consejoIA}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna lateral */}
        <div className="col-lg-4">
          {/* Info */}
          <div className="st-card p-4 mb-3">
            <h6 className="fw-semibold mb-3">Información</h6>
            <div className="d-flex flex-column gap-3">
              <div>
                <p className="mb-1" style={{ fontSize: '0.75rem', color: 'var(--st-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vencimiento</p>
                <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>{formatFecha(tarea.fechaVencimiento)}</p>
                <p className="mb-0" style={{ fontSize: '0.78rem', color: dr.color, fontWeight: 600 }}>{dr.label}</p>
              </div>
              <div>
                <p className="mb-1" style={{ fontSize: '0.75rem', color: 'var(--st-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creada</p>
                <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>{formatFecha(tarea.createdAt)}</p>
              </div>
              {tarea.fechaCompletada && (
                <div>
                  <p className="mb-1" style={{ fontSize: '0.75rem', color: 'var(--st-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completada</p>
                  <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem', color: '#10b981' }}>{formatFecha(tarea.fechaCompletada)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cambiar estado */}
          <div className="st-card p-4">
            <h6 className="fw-semibold mb-3">Cambiar Estado</h6>
            <div className="d-flex flex-column gap-2">
              {ESTADOS.map(estado => {
                const colors = { pendiente: '#64748b', en_progreso: '#6366f1', completada: '#10b981', cancelada: '#ef4444' };
                const isActive = tarea.estado === estado;
                return (
                  <button key={estado} className="btn btn-sm text-start d-flex align-items-center gap-2"
                    onClick={() => handleCambiarEstado(estado)} disabled={isActive}
                    style={{
                      background: isActive ? colors[estado] + '20' : 'var(--st-surface2)',
                      border: `1px solid ${isActive ? colors[estado] + '50' : 'var(--st-border)'}`,
                      color: isActive ? colors[estado] : 'var(--st-muted)',
                      borderRadius: 'var(--st-radius-sm)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.85rem'
                    }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[estado], flexShrink: 0 }} />
                    {ESTADO_LABELS[estado]}
                    {isActive && <i className="bi bi-check2 ms-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
