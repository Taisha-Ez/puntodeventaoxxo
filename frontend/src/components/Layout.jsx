import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TODOS = ['ayudante', 'encargado', 'lider']
const ADMIN = ['encargado', 'lider']

const MENU = [
  { ruta: '/', texto: 'Inicio', roles: TODOS },
  { ruta: '/pos', texto: 'Punto de venta', roles: TODOS },
  { ruta: '/productos', texto: 'Productos', roles: ADMIN },
  { ruta: '/categorias', texto: 'Categorías', roles: TODOS },
  { ruta: '/proveedores', texto: 'Proveedores', roles: ADMIN },
  { ruta: '/promociones', texto: 'Promociones', roles: TODOS },
  { ruta: '/inventario', texto: 'Inventario', roles: ADMIN },
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
        <h2>Oxxo</h2>
        <nav>
          {MENU.filter((i) => i.roles.includes(usuario.rol)).map((i) => (
            <NavLink key={i.ruta} to={i.ruta} end={i.ruta === '/'}>
              {i.texto}
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
