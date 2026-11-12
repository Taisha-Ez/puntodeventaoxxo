import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MENU = [
  { ruta: '/', texto: 'Inicio', roles: ['ayudante', 'encargado', 'lider'] },
  { ruta: '/productos', texto: 'Productos', roles: ['encargado', 'lider'] },
  { ruta: '/categorias', texto: 'Categorías', roles: ['ayudante', 'encargado', 'lider'] },
  { ruta: '/proveedores', texto: 'Proveedores', roles: ['encargado', 'lider'] },
  { ruta: '/promociones', texto: 'Promociones', roles: ['ayudante', 'encargado', 'lider'] },
  { ruta: '/inventario', texto: 'Inventario', roles: ['encargado', 'lider'] },
  { ruta: '/usuarios', texto: 'Usuarios', roles: ['lider'] },
]

export default function Layout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="menu">
        <h2>Punto de venta</h2>
        <nav>
          {MENU.filter((item) => item.roles.includes(usuario.rol)).map((item) => (
            <NavLink key={item.ruta} to={item.ruta} end={item.ruta === '/'}>
              {item.texto}
            </NavLink>
          ))}
        </nav>
        <div className="menu-pie">
          <p>
            {usuario.nombre} ({usuario.rol})
          </p>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}