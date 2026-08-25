import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="contenedor">
      <h1>Prueba Técnica — Gestión de Datos</h1>
      <p>Selecciona el módulo que deseas consultar o administrar.</p>
      <div className="home-cards">
        <Link to="/secop" className="home-card">
          <h2>SECOP</h2>
          <p>Procesos de contratación pública</p>
        </Link>
        <Link to="/cc2026" className="home-card">
          <h2>CC2026</h2>
          <p>Actuaciones de la Corte Constitucional</p>
        </Link>
      </div>
    </div>
  )
}
