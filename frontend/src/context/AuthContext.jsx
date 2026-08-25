import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const rol = localStorage.getItem('rol')
    return token ? { token, username, rol } : null
  })

  function login(token, username, rol) {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    localStorage.setItem('rol', rol)
    setAuth({ token, username, rol })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('rol')
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
