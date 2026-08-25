import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/secop">SECOP</Link>
        <Link to="/cc2026">CC2026</Link>
      </div>
      {auth && (
        <div className="navbar-user">
          <span>{auth.username} — <span className="badge-rol">{auth.rol}</span></span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </nav>
  )
}
