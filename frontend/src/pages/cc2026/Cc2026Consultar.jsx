import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Pencil, Trash2, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export default function Cc2026Consultar() {
  const [actuaciones, setActuaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const { auth } = useAuth();
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [actuacionAEliminar, setActuacionAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    api
      .get("/cc2026")
      .then((res) => setActuaciones(res.data))
      .finally(() => setCargando(false));
  }, []);

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const filtrados = actuaciones.filter((a) =>
    a.radicacion?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalPaginas = Math.ceil(filtrados.length / registrosPorPagina) || 1;
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimer = indiceUltimo - registrosPorPagina;
  const procesosPaginados = filtrados.slice(indicePrimer, indiceUltimo);

  const esConsulta = auth?.rol === "CONSULTA";
  const puedeCrear = auth?.rol === "ADMINISTRADOR" || auth?.rol === "DIGITADOR";
  const puedeEditarBorrar = auth?.rol === "ADMINISTRADOR";


  async function confirmarEliminacion(){
    if(!actuacionAEliminar) return;
    setEliminando(true);
    try {
       await api.delete(`/cc2026/${encodeURIComponent(actuacionAEliminar)}`);
       setActuaciones((prev) => prev.filter((a) => a.radicacion !== actuacionAEliminar));

       setMensajeExito(`La actuación ${actuacionAEliminar} fue eliminada correctamente.`);
       setTimeout(() => setMensajeExito(""), 4000);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setEliminando(false);
      setActuacionAEliminar(null);
    }
  }

  return (
    <div className="contenedor">
      <h1>CC2026 — Consultar</h1>

       {mensajeExito && (
        <div className="toast-exito">
          <CheckCircle2 size={20} className="toast-icono" />
          <span>{mensajeExito}</span>
          <button className="toast-cerrar" onClick={() => setMensajeExito("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="buscador">
        <input
          placeholder="Buscar por Radicación..."
          value={busqueda}
          onChange={handleBusquedaChange}
        />
      </div>

      {puedeCrear && (
        <Link
          to="/cc2026/nuevo"
          className="btn btn-primario"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            textDecoration: "none",
          }}
        >
          + Nuevo registro
        </Link>
      )}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="tabla-wrapper">
            <table
              className={esConsulta ? "no-copiar" : ""}
              onCopy={(e) => {
                if (esConsulta) e.preventDefault();
              }}
            >
              <thead>
                <tr>
                  <th>Radicación</th>
                  <th>Ponente</th>
                  <th>Demandante</th>
                  <th>Fecha</th>
                  <th>URL demanda</th>
                  {puedeEditarBorrar && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {procesosPaginados.length > 0 ? (
                  procesosPaginados.map((a) => (
                    <tr key={a.radicacion}>
                      <td>{a.radicacion}</td>
                      <td>{a.ponente}</td>
                      <td>{a.demandante}</td>
                      <td>{a.fecha}</td>
                      <td>
            
                        {a.urlDemanda && (
                          <a
                            href={a.urlDemanda}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver
                          </a>
                        )}
                      </td>
                      {puedeEditarBorrar && (
                        <td
                          className="acciones-fila"
                          style={{
                            display: "table-cell",
                            verticalAlign: "middle",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <Link
                              to={`/cc2026/editar/${encodeURIComponent(a.radicacion)}`}
                              className="btn-icono btn-icono-editar"
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              className="btn-icono btn-icono-eliminar"
                              onClick={() => setActuacionAEliminar(a.radicacion)}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={puedeEditarBorrar ? 6 : 5}
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      No se encontraron registros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="paginacion-contenedor">
            <div className="paginacion-info">
              Mostrando {filtrados.length === 0 ? 0 : indicePrimer + 1} -{" "}
              {Math.min(indiceUltimo, filtrados.length)} de {filtrados.length}
            </div>

            <div className="paginacion-controles">
              <label className="paginacion-selector">
                Filas:
                <select
                  value={registrosPorPagina}
                  onChange={(e) => {
                    setRegistrosPorPagina(Number(e.target.value));
                    setPaginaActual(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>

              <button
                className="btn-paginacion"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((prev) => prev - 1)}
                title="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="paginacion-texto">
                {paginaActual} / {totalPaginas}
              </span>

              <button
                className="btn-paginacion"
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
                onClick={() => setPaginaActual((prev) => prev + 1)}
                title="Página siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {actuacionAEliminar && (
        <div className="modal-overlay" onClick={() => !eliminando && setActuacionAEliminar(null)}>
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icono-alerta">
                <AlertTriangle size={24} />
              </div>
              <h2>¿Confirmar eliminación?</h2>
            </div>
            <p className="modal-cuerpo">
              ¿Estás seguro de que deseas eliminar la actuación <strong>{actuacionAEliminar}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="modal-acciones">
              <button
                className="btn btn-secundario"
                onClick={() => setActuacionAEliminar(null)}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                className="btn btn-peligro"
                onClick={confirmarEliminacion}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
