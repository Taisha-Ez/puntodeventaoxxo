import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categorias from './pages/Categorias'
import Proveedores from './pages/Proveedores'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
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
            {/* Aquí se irán agregando las demás pantallas */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}