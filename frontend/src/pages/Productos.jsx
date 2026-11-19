import { useEffect, useState } from 'react'
import cliente from '../api/cliente'

const VACIO = {
  codigoBarras: '',
  nombre: '',
  precioCompra: '',
  precioVenta: '',
  stockMinimo: '',
  categoriaId: '',
  proveedorId: '',
}

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

function armarDatos(form) {
  const datos = {
    codigoBarras: form.codigoBarras.trim(),
    nombre: form.nombre.trim(),
    precioCompra: Number(form.precioCompra),
    precioVenta: Number(form.precioVenta),
    categoriaId: Number(form.categoriaId),
  }
  if (form.stockMinimo !== '') datos.stockMinimo = Number(form.stockMinimo)
  if (form.proveedorId !== '') datos.proveedorId = Number(form.proveedorId)
  return datos
}

function dinero(valor) {
  return `$${Number(valor).toFixed(2)}`
}

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('')
  const [soloBajo, setSoloBajo] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [desactivados, setDesactivados] = useState([])

  async function cargarProductos() {
    try {
      const url = soloBajo
        ? '/productos/stock-bajo'
        : `/productos?buscar=${encodeURIComponent(filtro)}`
      const [lista, inactivos] = await Promise.all([
        cliente.get(url),
        cliente.get('/productos/desactivados'),
      ])
      setProductos(lista.data)
      setDesactivados(inactivos.data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  async function cargarListas() {
    try {
      const [cats, provs] = await Promise.all([
        cliente.get('/categorias'),
        cliente.get('/proveedores'),
      ])
      setCategorias(cats.data)
      setProveedores(provs.data)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    cargarListas()
  }, [])

  useEffect(() => {
    cargarProductos()
  }, [filtro, soloBajo])
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    try {
      const datos = armarDatos(form)
      if (editandoId) {
        await cliente.patch(`/productos/${editandoId}`, datos)
      } else {
        await cliente.post('/productos', datos)
      }
      cancelar()
      await cargarProductos()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function editar(p) {
    setEditandoId(p.id)
    setForm({
      codigoBarras: p.codigoBarras,
      nombre: p.nombre,
      precioCompra: String(p.precioCompra),
      precioVenta: String(p.precioVenta),
      stockMinimo: String(p.stockMinimo),
      categoriaId: p.categoria ? String(p.categoria.id) : '',
      proveedorId: p.proveedor ? String(p.proveedor.id) : '',
    })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(VACIO)
  }

  async function reactivar(p) {
    setError('')
    try {
      await cliente.patch(`/productos/${p.id}/reactivar`)
      await cargarProductos()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function desactivar(p) {
    if (!window.confirm(`¿Desactivar el producto "${p.nombre}"?`)) {
      return
    }
    setError('')
    try {
      await cliente.delete(`/productos/${p.id}`)
      await cargarProductos()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function buscar(e) {
    e.preventDefault()
    setSoloBajo(false)
    setFiltro(busqueda.trim())
  }

  return (
    <div>
      <h1>Productos</h1>

      <form onSubmit={guardar} className="formulario">
        <input
          placeholder="Código de barras *"
          value={form.codigoBarras}
          onChange={(e) => cambiar('codigoBarras', e.target.value)}
          maxLength={20}
          required
        />
        <input
          placeholder="Nombre *"
          value={form.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
          maxLength={120}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio compra *"
          value={form.precioCompra}
          onChange={(e) => cambiar('precioCompra', e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Precio venta *"
          value={form.precioVenta}
          onChange={(e) => cambiar('precioVenta', e.target.value)}
          required
        />
        <input
          type="number"
          step="1"
          min="0"
          placeholder="Stock mínimo (5)"
          value={form.stockMinimo}
          onChange={(e) => cambiar('stockMinimo', e.target.value)}
        />
        <select
          value={form.categoriaId}
          onChange={(e) => cambiar('categoriaId', e.target.value)}
          required
        >
          <option value="">Categoría *</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          value={form.proveedorId}
          onChange={(e) => cambiar('proveedorId', e.target.value)}
        >
          <option value="">Proveedor (opcional)</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-principal">
          {editandoId ? 'Guardar cambios' : 'Agregar'}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelar}>
            Cancelar
          </button>
        )}
      </form>

      <form onSubmit={buscar} className="barra-busqueda">
        <input
          placeholder="Buscar por nombre o código"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button
          type="button"
          onClick={() => {
            setBusqueda('')
            setFiltro('')
            setSoloBajo(false)
          }}
        >
          Ver todos
        </button>
        <label>
          <input
            type="checkbox"
            checked={soloBajo}
            onChange={(e) => setSoloBajo(e.target.checked)}
          />{' '}
          Solo stock bajo
        </label>
      </form>

      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Compra</th>
              <th>Venta</th>
              <th>Stock</th>
              <th>Mínimo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 && (
              <tr>
                <td colSpan={9}>No hay productos</td>
              </tr>
            )}
            {productos.map((p) => (
              <tr
                key={p.id}
                className={p.stockActual <= p.stockMinimo ? 'fila-bajo' : ''}
              >
                <td>{p.codigoBarras}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria?.nombre || '-'}</td>
                <td>{p.proveedor?.nombre || '-'}</td>
                <td>{dinero(p.precioCompra)}</td>
                <td>{dinero(p.precioVenta)}</td>
                <td>{p.stockActual}</td>
                <td>{p.stockMinimo}</td>
                <td>
                  <button onClick={() => editar(p)}>Editar</button>{' '}
                  <button onClick={() => desactivar(p)}>Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {desactivados.length > 0 && (
        <>
          <h2>Productos desactivados</h2>
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Venta</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {desactivados.map((p) => {
                const categoriaInactiva = p.categoria && !p.categoria.activo
                return (
                  <tr key={p.id} className="fila-inactiva">
                    <td>{p.codigoBarras}</td>
                    <td>{p.nombre}</td>
                    <td>
                      {p.categoria?.nombre}
                      {categoriaInactiva && ' (desactivada)'}
                    </td>
                    <td>{dinero(p.precioVenta)}</td>
                    <td>{p.stockActual}</td>
                    <td>
                      <button
                        onClick={() => reactivar(p)}
                        disabled={categoriaInactiva}
                        title={categoriaInactiva ? 'Primero reactiva su categoría' : ''}
                      >
                        Reactivar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}