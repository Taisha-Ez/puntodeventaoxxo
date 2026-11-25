import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Reloj from '../components/Reloj'

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [olvido, setOlvido] = useState(false)

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
      const texto = Array.isArray(mensaje) ? mensaje.join(', ') : mensaje
      setError(texto || 'No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login">
      <header className="login-top">
        <span className="shell-logo">OXXO</span>
        <span className="shell-titulo">Sistema de ventas e inventario</span>
        <Reloj />
      </header>

      <div className="login-centro">
        {!olvido ? (
          <form onSubmit={enviar} className="login-caja">
            <h1>Iniciar sesión</h1>
            <label htmlFor="login-usuario">Usuario</label>
            <input
              id="login-usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={cargando}>
              {cargando ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" className="login-enlace" onClick={() => setOlvido(true)}>
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        ) : (
          <div className="login-caja">
            <h1>Recuperar contraseña</h1>
            <p>
              Por seguridad, la contraseña no se restablece desde esta pantalla. Pide a un{' '}
              <strong>líder</strong> del sistema que te asigne una nueva contraseña desde la sección{' '}
              <strong>Usuarios</strong>.
            </p>
            <p>Si eres el líder y la olvidaste, contacta al responsable del sistema.</p>
            <button type="button" onClick={() => setOlvido(false)}>
              ← Volver a iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
