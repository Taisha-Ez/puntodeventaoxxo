import { useCallback, useEffect, useState } from 'react'
import cliente from '../api/cliente'

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

const dinero = (v) => `$${Number(v || 0).toFixed(2)}`
const fechaHora = (f) => (f ? new Date(f).toLocaleString('es-MX') : '-')

export default function Compras() {
  const [compras, setCompras] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [productos, setProductos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)

  // Formulario de nueva compra
  const [formAbierto, setFormAbierto] = useState(false)
  const [proveedorId, setProveedorId] = useState('')
  const [lineas, setLineas] = useState([])
  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [costo, setCosto] = useState('')

  // Detalle de una compra
  const [detalle, setDetalle] = useState(null)

  const cargarCompras = useCallback(async () => {
    setCargando(true)
    try {
      const { data } = await cliente.get('/compras', {
        params: filtro ? { estado: filtro } : {},
      })
      setCompras(data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }, [filtro])

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    cargarCompras()
  }, [cargarCompras])

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const [prov, prod] = await Promise.all([
          cliente.get('/proveedores'),
          cliente.get('/productos'),
        ])
        setProveedores(prov.data.filter((p) => p.activo !== false))
        setProductos(prod.data.filter((p) => p.activo !== false))
      } catch (err) {
        setError(mensajeError(err))
      }
    }
    cargarCatalogos()
  }, [])

  // Productos del proveedor elegido (si ninguno coincide, se muestran todos)
  const delProveedor = productos.filter(
    (p) => String(p.proveedor?.id ?? p.proveedorId) === String(proveedorId)
  )
  const opcionesProducto = delProveedor.length > 0 ? delProveedor : productos
  const total = lineas.reduce((suma, l) => suma + l.cantidad * l.costoUnitario, 0)

  function elegirProducto(id) {
    setProductoId(id)
    const p = productos.find((x) => String(x.id) === String(id))
    setCosto(p ? String(p.precioCompra ?? '') : '')
  }

  function cambiarProveedor(id) {
    setProveedorId(id)
    setLineas([])
    setProductoId('')
    setCosto('')
  }

  function agregarLinea(e) {
    e.preventDefault()
    setError('')
    if (!productoId) {
      setError('Elige un producto')
      return
    }
    if (lineas.some((l) => String(l.productoId) === String(productoId))) {
      setError('Ese producto ya está en la lista; quítalo y agrégalo con la cantidad total')
      return
    }
    const p = productos.find((x) => String(x.id) === String(productoId))
    setLineas([
      ...lineas,
      {
        productoId: Number(productoId),
        nombre: p.nombre,
        cantidad: Number(cantidad),
        costoUnitario: Number(costo),
      },
    ])
    setProductoId('')
    setCantidad('1')
    setCosto('')
  }

  function quitarLinea(id) {
    setLineas(lineas.filter((l) => l.productoId !== id))
  }

  function limpiarFormulario() {
    setFormAbierto(false)
    setProveedorId('')
    setLineas([])
    setProductoId('')
    setCantidad('1')
    setCosto('')
  }

  async function guardarCompra() {
    setError('')
    setExito('')
    if (!proveedorId) {
      setError('Elige un proveedor')
      return
    }
    if (lineas.length === 0) {
      setError('Agrega al menos un producto')
      return
    }
    try {
      const { data } = await cliente.post('/compras', {
        proveedorId: Number(proveedorId),
        detalles: lineas.map((l) => ({
          productoId: l.productoId,
          cantidad: l.cantidad,
          costoUnitario: l.costoUnitario,
        })),
      })
      setExito(`Compra #${data.id} registrada. El stock cambia cuando la marques como recibida.`)
      limpiarFormulario()
      await cargarCompras()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function verDetalle(id) {
    setError('')
    try {
      const { data } = await cliente.get(`/compras/${id}`)
      setDetalle(data)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function recibir(id) {
    if (!window.confirm(`¿Recibir la compra #${id}? Se sumará la mercancía al inventario.`)) return
    setError('')
    setExito('')
    try {
      const { data } = await cliente.patch(`/compras/${id}/recibir`)
      setExito(data.mensaje)
      setDetalle(null)
      await cargarCompras()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function cancelar(id) {
    if (!window.confirm(`¿Cancelar la compra #${id}?`)) return
    setError('')
    setExito('')
    try {
      const { data } = await cliente.patch(`/compras/${id}/cancelar`)
      setExito(data.mensaje)
      setDetalle(null)
      await cargarCompras()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  return (
    <div>
      <h1>Compras</h1>
      <p>
        Pedidos a proveedores. El stock solo aumenta cuando la compra se marca como recibida.
      </p>

      {error && <p style={{ color: '#c8102e' }}>{error}</p>}
      {exito && <p className="exito">{exito}</p>}

      {!formAbierto && (
        <button onClick={() => setFormAbierto(true)}>+ Nueva compra</button>
      )}

      {formAbierto && (
        <div className="formulario">
          <h2>Nueva compra</h2>

          <label>Proveedor</label>
          <select value={proveedorId} onChange={(e) => cambiarProveedor(e.target.value)}>
            <option value="">-- Elige un proveedor --</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          {proveedorId && (
            <form onSubmit={agregarLinea}>
              <label>Producto</label>
              <select value={productoId} onChange={(e) => elegirProducto(e.target.value)}>
                <option value="">-- Elige un producto --</option>
                {opcionesProducto.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (stock: {p.stockActual})
                  </option>
                ))}
              </select>

              <label>Cantidad</label>
              <input
                type="number"
                min="1"
                step="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />

              <label>Costo unitario</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                required
              />

              <button type="submit">Agregar a la lista</button>
            </form>
          )}

          {lineas.length > 0 && (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Costo</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((l) => (
                  <tr key={l.productoId}>
                    <td>{l.nombre}</td>
                    <td>{l.cantidad}</td>
                    <td>{dinero(l.costoUnitario)}</td>
                    <td>{dinero(l.cantidad * l.costoUnitario)}</td>
                    <td>
                      <button type="button" onClick={() => quitarLinea(l.productoId)}>
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3">
                    <strong>Total</strong>
                  </td>
                  <td colSpan="2">
                    <strong>{dinero(total)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <p>
            <button type="button" onClick={guardarCompra}>
              Guardar compra
            </button>{' '}
            <button type="button" onClick={limpiarFormulario}>
              Cancelar
            </button>
          </p>
        </div>
      )}

      <div className="barra-busqueda">
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="RECIBIDA">Recibidas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
        <button onClick={cargarCompras}>Actualizar</button>
      </div>

      {cargando && <p>Cargando...</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Registró</th>
            <th>Total</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {compras.length === 0 && !cargando && (
            <tr>
              <td colSpan="7">No hay compras</td>
            </tr>
          )}
          {compras.map((c) => (
            <tr key={c.id} className={c.estado === 'CANCELADA' ? 'fila-inactiva' : ''}>
              <td>{c.id}</td>
              <td>{fechaHora(c.fecha)}</td>
              <td>{c.proveedor?.nombre}</td>
              <td>{c.usuario?.nombre}</td>
              <td>{dinero(c.total)}</td>
              <td>{c.estado}</td>
              <td>
                <button onClick={() => verDetalle(c.id)}>Ver</button>
                {c.estado === 'PENDIENTE' && (
                  <>
                    {' '}
                    <button onClick={() => recibir(c.id)}>Recibir</button>{' '}
                    <button onClick={() => cancelar(c.id)}>Cancelar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detalle && (
        <div className="formulario">
          <h2>
            Compra #{detalle.id} · {detalle.estado}
          </h2>
          <p>
            Proveedor: {detalle.proveedor?.nombre} · {fechaHora(detalle.fecha)}
          </p>
          <table className="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Costo</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalle.detalles.map((d) => (
                <tr key={d.id}>
                  <td>{d.producto?.nombre}</td>
                  <td>{d.cantidad}</td>
                  <td>{dinero(d.costoUnitario)}</td>
                  <td>{dinero(d.subtotal)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{dinero(detalle.total)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => setDetalle(null)}>Cerrar</button>
        </div>
      )}
    </div>
  )
}
