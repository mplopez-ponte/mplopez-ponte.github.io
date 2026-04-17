import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tareaService } from '../services/api.service';
import ModalCrearTarea from '../components/tasks/ModalCrearTarea';

const PRIORIDAD_ORDEN = { urgente: 0, alta: 1, media: 2, baja: 3 };

export default function TareasPage() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ estado: '', prioridad: '', buscar: '' });
  const [showModal, setShowModal] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [vista, setVista] = useState('lista'); // 'lista' | 'kanban'

  const cargarTareas = useCallback(async () => {
    setCargando(true);
    try {
      const params = { page: pagina, limit: 15, ...Object.fromEntries(Object.entries(filtros).filter(([, v]) => v)) };
      const { data } = await tareaService.obtenerTodas(params);
      setTareas(data.tareas);
      setTotalPaginas(data.totalPaginas);
    } catch {
      toast.error('Error al cargar tareas');
    } finally {
      setCargando(false);
    }
  }, [filtros, pagina]);

  useEffect(() => { cargarTareas(); }, [cargarTareas]);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    try {
      await tareaService.eliminar(id);
      toast.success('Tarea eliminada');
      cargarTareas();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleCambiarEstado = async (id, estado) => {
    try {
      await tareaService.cambiarEstado(id, estado);
      toast.success('Estado actualizado');
      cargarTareas();
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const getDiasRestantes = (fecha) => {
    const dias = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return { label: `Venció hace ${Math.abs(dias)}d`, color: '#ef4444' };
    if (dias === 0) return { label: 'Vence hoy', color: '#f59e0b' };
    if (dias <= 3) return { label: `${dias}d restantes`, color: '#f59e0b' };
    return { label: `${dias}d restantes`, color: 'var(--st-muted)' };
  };

  const tareasPorEstado = (estado) => tareas.filter(t => t.estado === estado);

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="mb-1 fw-bold">Mis Tareas</h4>
          <p style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>
            {tareas.length} tarea{tareas.length !== 1 ? 's' : ''} encontrada{tareas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="d-flex gap-2">
          {/* Vista toggle */}
          <div className="btn-group" style={{ border: '1px solid var(--st-border)', borderRadius: 'var(--st-radius-sm)' }}>
            {[['lista','bi-list-ul'],['kanban','bi-kanban']].map(([v, icon]) => (
              <button key={v} className="btn btn-sm" onClick={() => setVista(v)}
                style={{
                  background: vista === v ? 'var(--st-primary)' : 'transparent',
                  color: vista === v ? '#fff' : 'var(--st-muted)',
                  border: 'none', padding: '6px 12px'
                }}>
                <i className={`bi ${icon}`} />
              </button>
            ))}
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg" /> Nueva tarea
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="st-card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text" style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}>
                <i className="bi bi-search" />
              </span>
              <input type="text" className="form-control" placeholder="Buscar tareas..."
                value={filtros.buscar} onChange={e => { setFiltros({ ...filtros, buscar: e.target.value }); setPagina(1); }} />
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" value={filtros.estado}
              onChange={e => { setFiltros({ ...filtros, estado: e.target.value }); setPagina(1); }}>
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" value={filtros.prioridad}
              onChange={e => { setFiltros({ ...filtros, prioridad: e.target.value }); setPagina(1); }}>
              <option value="">Todas las prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div className="col-12 col-md-1 text-end">
            <button className="btn btn-sm w-100" onClick={() => { setFiltros({ estado: '', prioridad: '', buscar: '' }); setPagina(1); }}
              style={{ background: 'var(--st-surface2)', color: 'var(--st-muted)', border: '1px solid var(--st-border)' }}
              title="Limpiar filtros">
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Vista lista */}
      {vista === 'lista' && (
        cargando ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : tareas.length === 0 ? (
          <div className="text-center py-5 st-card p-5">
            <i className="bi bi-inbox display-3" style={{ color: 'var(--st-muted)' }} />
            <p className="mt-3 mb-2 fw-semibold">No hay tareas</p>
            <p style={{ color: 'var(--st-muted)', fontSize: '0.875rem' }}>Crea tu primera tarea para empezar</p>
            <button className="btn btn-primary mt-2" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-lg me-1" /> Nueva tarea
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {tareas.sort((a, b) => (PRIORIDAD_ORDEN[a.prioridad] || 99) - (PRIORIDAD_ORDEN[b.prioridad] || 99)).map(tarea => {
              const dr = getDiasRestantes(tarea.fechaVencimiento);
              return (
                <div key={tarea._id} className="st-card p-3 d-flex align-items-start gap-3 flex-wrap">
                  {/* Check rápido */}
                  <div className="form-check mt-1 flex-shrink-0">
                    <input className="form-check-input" type="checkbox"
                      checked={tarea.estado === 'completada'}
                      onChange={() => handleCambiarEstado(tarea._id, tarea.estado === 'completada' ? 'pendiente' : 'completada')}
                      style={{ width: 18, height: 18, borderColor: 'var(--st-border)', cursor: 'pointer' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <Link to={`/tareas/${tarea._id}`} className="fw-semibold text-decoration-none"
                        style={{ color: tarea.estado === 'completada' ? 'var(--st-muted)' : 'var(--st-text)',
                                 textDecoration: tarea.estado === 'completada' ? 'line-through' : 'none' }}>
                        {tarea.titulo}
                      </Link>
                      <span className={`badge-prioridad badge-${tarea.prioridad}`}>{tarea.prioridad}</span>
                      <span className={`badge-prioridad badge-${tarea.estado}`}>
                        {tarea.estado === 'en_progreso' ? 'En Progreso' : tarea.estado?.charAt(0).toUpperCase() + tarea.estado?.slice(1)}
                      </span>
                      {tarea.subtareasGeneradasPorIA && <span className="ia-badge">IA</span>}
                    </div>
                    {tarea.descripcion && (
                      <p className="mb-1 text-truncate" style={{ color: 'var(--st-muted)', fontSize: '0.82rem', maxWidth: '100%' }}>
                        {tarea.descripcion}
                      </p>
                    )}
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <span style={{ fontSize: '0.78rem', color: dr.color }}>
                        <i className="bi bi-calendar3 me-1" />{formatFecha(tarea.fechaVencimiento)} · {dr.label}
                      </span>
                      {tarea.categoria && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--st-muted)' }}>
                          <i className="bi bi-tag me-1" />{tarea.categoria}
                        </span>
                      )}
                      {tarea.subtareas?.length > 0 && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--st-muted)' }}>
                          <i className="bi bi-list-check me-1" />
                          {tarea.subtareas.filter(s => s.completada).length}/{tarea.subtareas.length} subtareas
                        </span>
                      )}
                    </div>
                    {tarea.progreso > 0 && (
                      <div className="progress mt-2" style={{ height: 4, maxWidth: 200 }}>
                        <div className="progress-bar" style={{ width: `${tarea.progreso}%`, background: 'var(--st-primary)' }} />
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="d-flex gap-1 flex-shrink-0">
                    <Link to={`/tareas/${tarea._id}`} className="btn btn-sm"
                      style={{ background: 'transparent', border: '1px solid var(--st-border)', color: 'var(--st-muted)' }}
                      title="Ver detalle">
                      <i className="bi bi-eye" />
                    </Link>
                    <button className="btn btn-sm" onClick={() => handleEliminar(tarea._id)}
                      style={{ background: 'transparent', border: '1px solid var(--st-border)', color: '#f87171' }}
                      title="Eliminar">
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Vista Kanban */}
      {vista === 'kanban' && !cargando && (
        <div className="row g-3">
          {[
            { key: 'pendiente', label: 'Pendiente', color: '#64748b' },
            { key: 'en_progreso', label: 'En Progreso', color: '#6366f1' },
            { key: 'completada', label: 'Completada', color: '#10b981' },
            { key: 'cancelada', label: 'Cancelada', color: '#ef4444' }
          ].map(col => (
            <div key={col.key} className="col-md-3">
              <div className="st-card p-2 h-100">
                <div className="d-flex align-items-center gap-2 p-2 mb-2">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                  <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{col.label}</span>
                  <span className="badge ms-auto rounded-pill" style={{ background: col.color + '22', color: col.color, fontSize: '0.72rem' }}>
                    {tareasPorEstado(col.key).length}
                  </span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {tareasPorEstado(col.key).map(t => (
                    <Link key={t._id} to={`/tareas/${t._id}`} className="text-decoration-none"
                      style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', borderRadius: 8, padding: '10px 12px', display: 'block' }}>
                      <p className="mb-1 fw-semibold" style={{ fontSize: '0.83rem', color: 'var(--st-text)' }}>{t.titulo}</p>
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        <span className={`badge-prioridad badge-${t.prioridad}`}>{t.prioridad}</span>
                        {t.subtareasGeneradasPorIA && <span className="ia-badge">IA</span>}
                      </div>
                    </Link>
                  ))}
                  {tareasPorEstado(col.key).length === 0 && (
                    <p style={{ color: 'var(--st-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '16px 0' }}>Sin tareas</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button className="btn btn-sm" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}
            style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-text)' }}>
            <i className="bi bi-chevron-left" />
          </button>
          <span className="d-flex align-items-center px-3" style={{ fontSize: '0.85rem', color: 'var(--st-muted)' }}>
            Pág. {pagina} de {totalPaginas}
          </span>
          <button className="btn btn-sm" disabled={pagina === totalPaginas} onClick={() => setPagina(p => p + 1)}
            style={{ background: 'var(--st-surface2)', border: '1px solid var(--st-border)', color: 'var(--st-text)' }}>
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}

      {/* Modal */}
      <ModalCrearTarea show={showModal} onHide={() => setShowModal(false)} onCreada={cargarTareas} />
    </div>
  );
}
