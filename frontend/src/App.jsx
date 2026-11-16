import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categorias from './pages/Categorias'
import Proveedores from './pages/Proveedores'
import Productos from './pages/Productos'
import Promociones from './pages/Promociones'
import Inventario from './pages/Inventario'
import Usuarios from './pages/Usuarios'
import PuntoVenta from './pages/PuntoVenta'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* El punto de venta ocupa toda la pantalla, sin el menú lateral */}
          <Route
            path="/pos"
            element={
              <RutaProtegida>
                <PuntoVenta />
              </RutaProtegida>
            }
          />

          <Route
            path="/"
            element={
              <RutaProtegida>
                <Layout />
              </RutaProtegida>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="categorias" element={<Categorias />} />
            <Route
              path="proveedores"
              element={
                <RutaProtegida roles={['encargado', 'lider']}>
                  <Proveedores />
                </RutaProtegida>
              }
            />
            <Route
              path="productos"
              element={
                <RutaProtegida roles={['encargado', 'lider']}>
                  <Productos />
                </RutaProtegida>
              }
            />
            <Route path="promociones" element={<Promociones />} />
            <Route
              path="inventario"
              element={
                <RutaProtegida roles={['encargado', 'lider']}>
                  <Inventario />
                </RutaProtegida>
              }
            />
            <Route
              path="usuarios"
              element={
                <RutaProtegida roles={['lider']}>
                  <Usuarios />
                </RutaProtegida>
              }
            />
            {/* Aquí se irán agregando las demás pantallas */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
