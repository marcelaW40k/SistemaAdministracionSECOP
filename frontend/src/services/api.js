import axios from 'axios'

// Ajusta esta URL si tu backend Spring Boot corre en otro host/puerto
const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({

  baseURL: rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('rol')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
