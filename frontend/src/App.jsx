import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import SecopConsultar from './pages/secop/SecopConsultar'
import SecopFormulario from './pages/secop/SecopFormulario'
import Cc2026Consultar from './pages/cc2026/Cc2026Consultar'
import Cc2026Formulario from './pages/cc2026/Cc2026Formulario'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />

          <Route path="/secop" element={
            <ProtectedRoute><SecopConsultar /></ProtectedRoute>
          } />
          <Route path="/secop/nuevo" element={
            <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'DIGITADOR']}>
              <SecopFormulario />
            </ProtectedRoute>
          } />
          <Route path="/secop/editar/:referencia" element={
            <ProtectedRoute rolesPermitidos={['ADMINISTRADOR']}>
              <SecopFormulario />
            </ProtectedRoute>
          } />

          <Route path="/cc2026" element={
            <ProtectedRoute><Cc2026Consultar /></ProtectedRoute>
          } />
          <Route path="/cc2026/nuevo" element={
            <ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'DIGITADOR']}>
              <Cc2026Formulario />
            </ProtectedRoute>
          } />
          <Route path="/cc2026/editar/:radicacion" element={
            <ProtectedRoute rolesPermitidos={['ADMINISTRADOR']}>
              <Cc2026Formulario />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
