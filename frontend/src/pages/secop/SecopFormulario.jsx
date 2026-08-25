import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

export default function SecopFormulario() {
  const { referencia } = useParams()
  const esEdicion = Boolean(referencia)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    referencia: '',
    pais: 'COLOMBIA',
    entidadEstatal: '',
    descripcion: '',
    faseActual: '',
    fechaPublicacion: '',
    fechaPresentacionOfertas: '',
    urlDetalle: ''
  })

  useEffect(() => {
    if (esEdicion) {
      const paramId = referencia || id
      if (paramId && paramId !== 'undefined') {
        api.get(`/secop/${encodeURIComponent(paramId)}`)
          .then((res) => {
            if (res.data) {
              setForm(res.data)
            }
          })
          .catch((err) => {
            console.error("Error al cargar los datos de SECOP:", err)
          })
        }
      }
  }, [referencia, esEdicion])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (esEdicion) {
      await api.put(`/secop/${encodeURIComponent(referencia)}`, form)
    } else {
      await api.post('/secop', form)
    }
    navigate('/secop')
  }

  return (
    <div className="contenedor">
      <h1>SECOP — {esEdicion ? 'Modificar' : 'Crear'} registro</h1>
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <label>
            Referencia (llave, no se puede editar)
            <input name="referencia" value={form.referencia} onChange={handleChange}
                   required disabled={esEdicion} />
          </label>
          <label>
            País
            <input name="pais" value={form.pais || ''} onChange={handleChange} />
          </label>
          <label>
            Entidad Estatal
            <input name="entidadEstatal" value={form.entidadEstatal || ''} onChange={handleChange} />
          </label>
          <label>
            Descripción
            <textarea name="descripcion" value={form.descripcion || ''} onChange={handleChange} />
          </label>
          <label>
            Fase actual
            <input name="faseActual" value={form.faseActual || ''} onChange={handleChange} />
          </label>
          <label>
            Fecha de publicación
            <input name="fechaPublicacion" value={form.fechaPublicacion || ''} onChange={handleChange} />
          </label>
          <label>
            Fecha de presentación de ofertas
            <input name="fechaPresentacionOfertas" value={form.fechaPresentacionOfertas || ''} onChange={handleChange} />
          </label>
          <label>
            URL detalle
            <input name="urlDetalle" value={form.urlDetalle || ''} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primario">
              {esEdicion ? 'Guardar cambios' : 'Crear'}
            </button>
            <button type="button" className="btn btn-secundario" onClick={() => navigate('/secop')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
