import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Pencil, Trash2 } from 'lucide-react'

/*
  Pantalla 1 de 3: CONSULTAR (requisito c).
  Aqui tambien viven los requisitos d.iii (no copiar texto si es rol Consulta)
  y e.ii (Column-8 Url / url_detalle debe ser clickeable).
*/
export default function SecopConsultar() {
  const [procesos, setProcesos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    api
      .get("/secop")
      .then((res) => setProcesos(res.data))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = procesos.filter((p) =>
    p.referencia?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const esConsulta = auth?.rol === "CONSULTA";
  const puedeCrear = auth?.rol === "ADMINISTRADOR" || auth?.rol === "DIGITADOR";
  const puedeEditarBorrar = auth?.rol === "ADMINISTRADOR";

  async function handleEliminar(referencia) {
    if (!confirm(`¿Eliminar el proceso ${referencia}?`)) return;
    await api.delete(`/secop/${encodeURIComponent(referencia)}`);
    setProcesos((prev) => prev.filter((p) => p.referencia !== referencia));
  }

  return (
    <div className="contenedor">
      <h1>SECOP — Consultar</h1>

      <div className="buscador">
        <input
          placeholder="Buscar por Referencia..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
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
              {filtrados.map((p) => (
                <tr key={p.referencia}>
                  <td>{p.referencia}</td>
                  <td>{p.entidadEstatal}</td>
                  <td>{p.descripcion?.slice(0, 80)}</td>
                  <td>{p.fechaPublicacion}</td>
                  <td>
                    {/* Requisito e.ii: url_detalle (Column-8 Url) debe ser clickeable */}
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
                    <td className="acciones-fila" style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                     <div style={{display: 'flex'}}>
                       <Link
                        to={`/secop/editar/${encodeURIComponent(p.referencia)}`}
                        className="btn-icono btn-icono-editar"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="btn-icono btn-icono-eliminar"
                        onClick={() => handleEliminar(p.referencia)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                     </div>
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
