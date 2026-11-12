import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  if (usuario) {
    return <Navigate to="/" replace />
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await login(nombreUsuario, password)
      navigate('/')
    } catch (err) {
      const mensaje = err.response?.data?.message
      setError(Array.isArray(mensaje) ? mensaje.join(', ') : mensaje || 'No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login">
      <form onSubmit={enviar} className="login-caja">
        <h1>Iniciar sesión</h1>
        <label>Usuario</label>
        <input value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}