import { createContext, useContext, useState } from 'react'
import cliente from '../api/cliente.js'

const AuthContext = createContext(null)

// Lee el payload del JWT. Si el token no es valido o ya expiro regresa null.
function leerToken(token) {
  if (!token) return null
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    const payload = JSON.parse(json)
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

// El rol, id y usuario salen del token. Del localStorage solo se toma el
// nombre para mostrarlo, porque el token no lo incluye.
function usuarioDesdeToken() {
  const payload = leerToken(localStorage.getItem('token'))
  if (!payload) {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    return null
  }
  return {
    id: payload.sub,
    usuario: payload.usuario,
    rol: payload.rol,
    nombre: localStorage.getItem('nombre') || payload.usuario,
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioDesdeToken)

  async function login(nombreUsuario, password) {
    const { data } = await cliente.post('/auth/login', {
      usuario: nombreUsuario,
      password,
    })
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('nombre', data.usuario?.nombre ?? '')
    localStorage.removeItem('usuario')
    setUsuario(usuarioDesdeToken())
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
