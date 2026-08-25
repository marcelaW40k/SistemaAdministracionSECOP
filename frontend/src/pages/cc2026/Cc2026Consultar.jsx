import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";

export default function Cc2026Consultar() {
  const [actuaciones, setActuaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    api
      .get("/cc2026")
      .then((res) => setActuaciones(res.data))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = actuaciones.filter((a) =>
    a.radicacion?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const esConsulta = auth?.rol === "CONSULTA";
  const puedeCrear = auth?.rol === "ADMINISTRADOR" || auth?.rol === "DIGITADOR";
  const puedeEditarBorrar = auth?.rol === "ADMINISTRADOR";

  async function handleEliminar(radicacion) {
    if (!confirm(`¿Eliminar la actuación ${radicacion}?`)) return;
    await api.delete(`/cc2026/${encodeURIComponent(radicacion)}`);
    setActuaciones((prev) => prev.filter((a) => a.radicacion !== radicacion));
  }

  return (
    <div className="contenedor">
      <h1>CC2026 — Consultar</h1>

      <div className="buscador">
        <input
          placeholder="Buscar por Radicación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
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
              {filtrados.map((a) => (
                <tr key={a.radicacion}>
                  <td>{a.radicacion}</td>
                  <td>{a.ponente}</td>
                  <td>{a.demandante}</td>
                  <td>{a.fecha}</td>
                  <td>
                    {/* Requisito e.i: url_demanda debe ser clickeable */}
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
                    <td className="acciones-fila">
                      <Link
                        to={`/secop/editar/${encodeURIComponent(a.referencia)}`}
                        className="btn-icono btn-icono-editar"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="btn-icono btn-icono-eliminar"
                        onClick={() => handleEliminar(a.referencia)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
