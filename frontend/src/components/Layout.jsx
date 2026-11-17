import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Reloj from './Reloj'

const TODOS = ['ayudante', 'encargado', 'lider']
const ADMIN = ['encargado', 'lider']

const MENU = [
  { ruta: '/', texto: 'Inicio', roles: TODOS },
  { ruta: '/pos', texto: 'Punto de venta', roles: TODOS },
  { ruta: '/productos', texto: 'Productos', roles: ADMIN },
  { ruta: '/categorias', texto: 'Categorías', roles: TODOS },
  { ruta: '/proveedores', texto: 'Proveedores', roles: ADMIN },
  { ruta: '/promociones', texto: 'Promociones', roles: TODOS },
  { ruta: '/compras', texto: 'Compras', roles: ADMIN },
  { ruta: '/inventario', texto: 'Inventario', roles: ADMIN },
  { ruta: '/devoluciones', texto: 'Devoluciones', roles: ADMIN },
  { ruta: '/ventas', texto: 'Ventas', roles: ADMIN },
  { ruta: '/turnos', texto: 'Turnos', roles: ADMIN },
  { ruta: '/cajas', texto: 'Cajas', roles: ['lider'] },
  { ruta: '/usuarios', texto: 'Usuarios', roles: ['lider'] },
]

export default function Layout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(() => {
    try {
      return localStorage.getItem('menuAbierto') !== 'no'
    } catch {
      return true
    }
  })

  function alternarMenu() {
    const nuevo = !menuAbierto
    setMenuAbierto(nuevo)
    try {
      localStorage.setItem('menuAbierto', nuevo ? 'si' : 'no')
    } catch {
      /* si no se puede guardar, no pasa nada */
    }
  }

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  return (
    <div className="shell">
      <header className="shell-top">
        <button className="shell-hamburguesa" onClick={alternarMenu} title="Mostrar u ocultar menú">
          ☰
        </button>
        <span className="shell-logo">OXXO</span>
        <span className="shell-titulo">Sistema de ventas e inventario</span>
        <Reloj />
        <span>
          Le atiende: {usuario.nombre} ({usuario.rol})
        </span>
        <button className="shell-salir" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <div className="shell-cuerpo">
        <nav className={menuAbierto ? 'shell-menu' : 'shell-menu oculto'}>
          {MENU.filter((i) => i.roles.includes(usuario.rol)).map((i) => (
            <NavLink key={i.ruta} to={i.ruta} end={i.ruta === '/'}>
              {i.texto}
            </NavLink>
          ))}
        </nav>
        <main className="shell-contenido">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
