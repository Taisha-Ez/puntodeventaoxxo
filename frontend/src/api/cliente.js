import axios from 'axios'

const cliente = axios.create({
  baseURL: '/api',
})

cliente.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

cliente.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url === '/auth/login'
    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem('token')
      localStorage.removeItem('nombre')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default cliente