import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', { username, password })
      const { token, username: user, rol } = res.data
      login(token, user, rol)
      navigate('/')
    } catch (err) {
      setError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div className="contenedor" style={{ maxWidth: 420, marginTop: '3rem' }}>
      <div className="form-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Usuario
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primario">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
