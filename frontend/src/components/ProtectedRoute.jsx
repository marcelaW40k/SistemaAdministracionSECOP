import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const { auth } = useAuth()

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(auth.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}
