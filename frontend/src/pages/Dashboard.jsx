import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import cliente from '../api/cliente'
import { useAuth } from '../context/AuthContext'

const TIPOS = {
  DOS_POR_UNO: '2 x 1',
  PORCENTAJE: 'Descuento',
  PRECIO_ESPECIAL: 'Precio especial',
}

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

function textoValor(p) {
  if (p.tipo === 'PORCENTAJE') return `${Number(p.valor)}%`
  if (p.tipo === 'PRECIO_ESPECIAL') return `$${Number(p.valor).toFixed(2)}`
  return ''
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const verInventario = ['encargado', 'lider'].includes(usuario.rol)

  const [promociones, setPromociones] = useState([])
  const [stockBajo, setStockBajo] = useState([])
  const [totalProductos, setTotalProductos] = useState(0)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    try {
      const peticiones = [cliente.get('/promociones/vigentes')]
      if (verInventario) {
        peticiones.push(cliente.get('/productos/stock-bajo'))
        peticiones.push(cliente.get('/productos'))
      }
      const [promos, bajo, todos] = await Promise.all(peticiones)
      setPromociones(promos.data)
      if (verInventario) {
        setStockBajo(bajo.data)
        setTotalProductos(todos.data.length)
      }
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    cargar()
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  return (
    <div>
      <h1>Bienvenido, {usuario.nombre}</h1>
      <p>Tu rol es: {usuario.rol}</p>

      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
          {verInventario && (
            <div className="tarjetas">
              <div className="tarjeta">
                <span className="tarjeta-numero">{totalProductos}</span>
                <span>Productos</span>
              </div>
              <div
                className={
                  stockBajo.length > 0 ? 'tarjeta tarjeta-alerta' : 'tarjeta'
                }
              >
                <span className="tarjeta-numero">{stockBajo.length}</span>
                <span>Con stock bajo</span>
              </div>
              <div className="tarjeta">
                <span className="tarjeta-numero">{promociones.length}</span>
                <span>Promociones vigentes</span>
              </div>
            </div>
          )}

          {verInventario && (
            <section>
              <h2>Productos con stock bajo</h2>
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Proveedor</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {stockBajo.length === 0 && (
                    <tr>
                      <td colSpan={4}>Todo el inventario está en orden</td>
                    </tr>
                  )}
                  {stockBajo.map((p) => (
                    <tr key={p.id} className="fila-bajo">
                      <td>{p.nombre}</td>
                      <td>{p.proveedor?.nombre || '-'}</td>
                      <td>{p.stockActual}</td>
                      <td>{p.stockMinimo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stockBajo.length > 0 && (
                <p>
                  <Link to="/inventario">Ir a Inventario para registrar ajustes</Link>
                </p>
              )}
            </section>
          )}

          <section>
            <h2>Promociones vigentes hoy</h2>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Promoción</th>
                  <th>Tipo</th>
                  <th>Vigente hasta</th>
                  <th>Productos</th>
                </tr>
              </thead>
              <tbody>
                {promociones.length === 0 && (
                  <tr>
                    <td colSpan={4}>No hay promociones vigentes hoy</td>
                  </tr>
                )}
                {promociones.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>
                      {TIPOS[p.tipo]} {textoValor(p)}
                    </td>
                    <td>{p.fechaFin}</td>
                    <td>{p.productos.map((x) => x.nombre).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}