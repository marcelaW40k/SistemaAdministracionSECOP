import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function Cc2026Formulario() {
  const { radicacion } = useParams();
  const esEdicion = Boolean(radicacion);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    radicacion: "",
    numero: "",
    urlProceso: "",
    ponente: "",
    normaDemandada: "",
    demandante: "",
    fecha: "",
    urlDemanda: "",
    captureDate: "",
  });

  useEffect(() => {
    if (esEdicion && radicacion !== "undefined") {
      api.get(`/cc2026/${encodeURIComponent(radicacion)}`).then((res) => {
        if (res.data) {
          setForm(res.data);
        }
      });
    }
  }, [radicacion, esEdicion]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (esEdicion) {
        await api.put(`/cc2026/${encodeURIComponent(radicacion)}`, form);
        navigate("/secop", {
          state: {
            mensaje: `El registro ${radicacion} fue actualizado correctamente.`,
          },
        });
      } else {
        await api.post("/cc2026", form);
        navigate("/cc2026", {
          state: {
            mensaje: `El registro ${form.radicacion} fue creado correctamente.`,
          },
        });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          `Ya existe un registro con la radicación "${form.radicacion}". Usa una radicación distinta.`,
        );
      } else {
        setError("Ocurrió un error al guardar el registro. Intenta de nuevo.");
      }
    }
  }

  return (
    <div className="contenedor">
      <h1>CC2026 — {esEdicion ? "Modificar" : "Crear"} registro</h1>
      
      <div className="form-box">
         {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Radicación (llave, no se puede editar)
            <input
              name="radicacion"
              value={form.radicacion}
              onChange={handleChange}
              required
              disabled={esEdicion}
            />
          </label>
          <label>
            Número
            <input
              name="numero"
              type="number"
              value={form.numero || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Ponente
            <input
              name="ponente"
              value={form.ponente || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Norma demandada
            <textarea
              name="normaDemandada"
              value={form.normaDemandada || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Demandante
            <input
              name="demandante"
              value={form.demandante || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Fecha
            <input
              name="fecha"
              value={form.fecha || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            URL proceso
            <input
              name="urlProceso"
              value={form.urlProceso || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            URL demanda
            <input
              name="urlDemanda"
              value={form.urlDemanda || ""}
              onChange={handleChange}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primario">
              {esEdicion ? "Guardar cambios" : "Crear"}
            </button>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => navigate("/cc2026")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
