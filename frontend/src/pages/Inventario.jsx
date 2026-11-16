import { useEffect, useState } from 'react'
import cliente from '../api/cliente'

const VACIO = { productoId: '', tipo: 'AJUSTE', cantidad: '', motivo: '' }

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

export default function Inventario() {
  const [productos, setProductos] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [form, setForm] = useState(VACIO)
  const [filtroProducto, setFiltroProducto] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargarProductos() {
    try {
      const { data } = await cliente.get('/productos')
      setProductos(data)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function cargarMovimientos() {
    try {
      const url = filtroProducto
        ? `/movimientos-inventario?productoId=${filtroProducto}`
        : '/movimientos-inventario'
      const { data } = await cliente.get(url)
      setMovimientos(data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    cargarProductos()
  }, [])

  useEffect(() => {
    cargarMovimientos()
  }, [filtroProducto])
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setExito('')
    const cantidad = parseInt(form.cantidad, 10)
    if (!cantidad) {
      setError('La cantidad no puede ser 0')
      return
    }
    try {
      await cliente.post('/movimientos-inventario', {
        productoId: Number(form.productoId),
        tipo: form.tipo,
        cantidad: form.tipo === 'MERMA' ? Math.abs(cantidad) : cantidad,
        motivo: form.motivo.trim(),
      })
      setForm({ ...VACIO, tipo: form.tipo })
      setExito('Movimiento registrado')
      await Promise.all([cargarProductos(), cargarMovimientos()])
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  return (
    <div>
      <h1>Inventario</h1>

      <form onSubmit={guardar} className="formulario">
        <select
          value={form.productoId}
          onChange={(e) => cambiar('productoId', e.target.value)}
          required
        >
          <option value="">Producto *</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} (stock: {p.stockActual})
            </option>
          ))}
        </select>
        <select
          value={form.tipo}
          onChange={(e) => cambiar('tipo', e.target.value)}
        >
          <option value="AJUSTE">Ajuste (+ suma, - resta)</option>
          <option value="MERMA">Merma (piezas perdidas)</option>
        </select>
        <input
          type="number"
          step="1"
          min={form.tipo === 'MERMA' ? 1 : undefined}
          placeholder="Cantidad *"
          value={form.cantidad}
          onChange={(e) => cambiar('cantidad', e.target.value)}
          required
        />
        <input
          placeholder="Motivo *"
          value={form.motivo}
          onChange={(e) => cambiar('motivo', e.target.value)}
          maxLength={200}
          required
        />
        <button type="submit" className="btn-principal">
          Registrar
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {exito && <p className="exito">{exito}</p>}

      <div className="barra-busqueda">
        <label>
          Ver historial de:{' '}
          <select
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
          >
            <option value="">Todos los productos</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Motivo</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 && (
              <tr>
                <td colSpan={6}>No hay movimientos</td>
              </tr>
            )}
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td>{new Date(m.fecha).toLocaleString('es-MX')}</td>
                <td>{m.producto?.nombre}</td>
                <td>{m.tipo}</td>
                <td className={m.cantidad > 0 ? 'positivo' : 'negativo'}>
                  {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                </td>
                <td>{m.motivo || '-'}</td>
                <td>{m.usuario?.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}