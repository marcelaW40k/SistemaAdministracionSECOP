import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

export default function SecopConsultar() {
  const [procesos, setProcesos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const { auth } = useAuth();
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [procesoAEliminar, setProcesoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const location = useLocation();

  useEffect(() => {
    api
      .get("/secop")
      .then((res) => setProcesos(res.data))
      .finally(() => setCargando(false));

    if (location.state?.mensaje) {
      setMensajeExito(location.state.mensaje);
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => setMensajeExito(""), 4000);
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [location]);


  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const filtrados = procesos.filter((p) =>
    p.referencia?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalPaginas = Math.ceil(filtrados.length / registrosPorPagina) || 1;
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimer = indiceUltimo - registrosPorPagina;
  const procesosPaginados = filtrados.slice(indicePrimer, indiceUltimo);

  const esConsulta = auth?.rol === "CONSULTA";
  const puedeCrear = auth?.rol === "ADMINISTRADOR" || auth?.rol === "DIGITADOR";
  const puedeEditarBorrar = auth?.rol === "ADMINISTRADOR";

  async function confirmarEliminacion() {
    if (!procesoAEliminar) return;
    setEliminando(true);
    try {
      await api.delete(`/secop/${encodeURIComponent(procesoAEliminar)}`);
      setProcesos((prev) =>
        prev.filter((p) => p.referencia !== procesoAEliminar),
      );

      setMensajeExito(
        `El proceso ${procesoAEliminar} fue eliminado correctamente.`,
      );
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setEliminando(false);
      setProcesoAEliminar(null);
    }
  }

  return (
    <div className="contenedor">
      <h1>SECOP — Consultar</h1>

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
          placeholder="Buscar por Referencia..."
          value={busqueda}
          onChange={handleBusquedaChange}
        />
      </div>

      {puedeCrear && (
        <Link
          to="/secop/nuevo"
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
                  <th>Referencia</th>
                  <th>Entidad Estatal</th>
                  <th>Descripción</th>
                  <th>Fase publicación</th>
                  <th>Detalle</th>
                  {puedeEditarBorrar && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {procesosPaginados.length > 0 ? (
                  procesosPaginados.map((p) => (
                    <tr key={p.referencia}>
                      <td>{p.referencia}</td>
                      <td>{p.entidadEstatal}</td>
                      <td>{p.descripcion?.slice(0, 80)}</td>
                      <td>{p.fechaPublicacion}</td>
                      <td>
                        {p.urlDetalle && (
                          <a
                            href={p.urlDetalle}
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
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Link
                              to={`/secop/editar/${encodeURIComponent(p.referencia)}`}
                              className="btn-icono btn-icono-editar"
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              className="btn-icono btn-icono-eliminar"
                              onClick={() => setProcesoAEliminar(p.referencia)}
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

      {procesoAEliminar && (
        <div
          className="modal-overlay"
          onClick={() => !eliminando && setProcesoAEliminar(null)}
        >
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icono-alerta">
                <AlertTriangle size={24} />
              </div>
              <h2>¿Confirmar eliminación?</h2>
            </div>
            <p className="modal-cuerpo">
              ¿Estás seguro de que deseas eliminar el proceso{" "}
              <strong>{procesoAEliminar}</strong>? Esta acción no se puede
              deshacer.
            </p>
            <div className="modal-acciones">
              <button
                className="btn btn-secundario"
                onClick={() => setProcesoAEliminar(null)}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                className="btn btn-peligro"
                onClick={confirmarEliminacion}
                disabled={eliminando}
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
