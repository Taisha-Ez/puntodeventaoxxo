import { useEffect, useState } from 'react'
import cliente from '../api/cliente'
import { useAuth } from '../context/AuthContext'

const TIPOS = {
  DOS_POR_UNO: '2 x 1',
  PORCENTAJE: 'Porcentaje de descuento',
  PRECIO_ESPECIAL: 'Precio especial',
}

const VACIO = {
  nombre: '',
  tipo: 'PORCENTAJE',
  valor: '',
  fechaInicio: '',
  fechaFin: '',
  productoIds: [],
}

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

function textoValor(p) {
  if (p.tipo === 'PORCENTAJE') return `${Number(p.valor)}%`
  if (p.tipo === 'PRECIO_ESPECIAL') return `$${Number(p.valor).toFixed(2)}`
  return '-'
}

export default function Promociones() {
  const { usuario } = useAuth()
  const esLider = usuario.rol === 'lider'

  const [promociones, setPromociones] = useState([])
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [filtroProducto, setFiltroProducto] = useState('')
  const [soloVigentes, setSoloVigentes] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargarPromociones() {
    try {
      const url = soloVigentes ? '/promociones/vigentes' : '/promociones'
      const { data } = await cliente.get(url)
      setPromociones(data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  async function cargarProductos() {
    try {
      const { data } = await cliente.get('/productos')
      setProductos(data)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    if (esLider) cargarProductos()
  }, [])

  useEffect(() => {
    cargarPromociones()
  }, [soloVigentes])
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  function marcarProducto(id) {
    const ya = form.productoIds.includes(id)
    const nuevos = ya
      ? form.productoIds.filter((x) => x !== id)
      : [...form.productoIds, id]
    setForm({ ...form, productoIds: nuevos })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    if (form.productoIds.length === 0) {
      setError('Selecciona al menos un producto')
      return
    }
    const datos = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      productoIds: form.productoIds,
    }
    if (form.tipo !== 'DOS_POR_UNO') datos.valor = Number(form.valor)
    try {
      if (editandoId) {
        await cliente.patch(`/promociones/${editandoId}`, datos)
      } else {
        await cliente.post('/promociones', datos)
      }
      cancelar()
      await cargarPromociones()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function editar(p) {
    setEditandoId(p.id)
    setForm({
      nombre: p.nombre,
      tipo: p.tipo,
      valor: p.valor ? String(p.valor) : '',
      fechaInicio: p.fechaInicio,
      fechaFin: p.fechaFin,
      productoIds: p.productos.map((x) => x.id),
    })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(VACIO)
    setFiltroProducto('')
  }

  async function desactivar(p) {
    if (!window.confirm(`¿Desactivar la promoción "${p.nombre}"?`)) {
      return
    }
    setError('')
    try {
      await cliente.delete(`/promociones/${p.id}`)
      await cargarPromociones()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  const productosVisibles = productos.filter((p) => {
    const texto = filtroProducto.trim().toLowerCase()
    if (!texto) return true
    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.codigoBarras.includes(texto)
    )
  })

  return (
    <div>
      <h1>Promociones</h1>

      {esLider && (
        <form onSubmit={guardar} className="formulario">
          <input
            placeholder="Nombre *"
            value={form.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            maxLength={100}
            required
          />
          <select
            value={form.tipo}
            onChange={(e) => cambiar('tipo', e.target.value)}
          >
            {Object.entries(TIPOS).map(([clave, texto]) => (
              <option key={clave} value={clave}>
                {texto}
              </option>
            ))}
          </select>
          {form.tipo !== 'DOS_POR_UNO' && (
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder={
                form.tipo === 'PORCENTAJE' ? 'Descuento (%) *' : 'Precio *'
              }
              value={form.valor}
              onChange={(e) => cambiar('valor', e.target.value)}
              required
            />
          )}
          <label>
            Inicio{' '}
            <input
              type="date"
              value={form.fechaInicio}
              onChange={(e) => cambiar('fechaInicio', e.target.value)}
              required
            />
          </label>
          <label>
            Fin{' '}
            <input
              type="date"
              value={form.fechaFin}
              onChange={(e) => cambiar('fechaFin', e.target.value)}
              required
            />
          </label>

          <div className="lista-productos">
            <input
              placeholder="Filtrar productos por nombre o código"
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
            />
            {productosVisibles.length === 0 && <p>No hay productos</p>}
            {productosVisibles.map((p) => (
              <label key={p.id} className="producto-opcion">
                <input
                  type="checkbox"
                  checked={form.productoIds.includes(p.id)}
                  onChange={() => marcarProducto(p.id)}
                />{' '}
                {p.nombre} ({p.codigoBarras})
              </label>
            ))}
            <small>Seleccionados: {form.productoIds.length}</small>
          </div>

          <button type="submit" className="btn-principal">
            {editandoId ? 'Guardar cambios' : 'Agregar'}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </form>
      )}

      <div className="barra-busqueda">
        <label>
          <input
            type="checkbox"
            checked={soloVigentes}
            onChange={(e) => setSoloVigentes(e.target.checked)}
          />{' '}
          Solo vigentes hoy
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Productos</th>
              <th>Estado</th>
              {esLider && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {promociones.length === 0 && (
              <tr>
                <td colSpan={esLider ? 8 : 7}>No hay promociones</td>
              </tr>
            )}
            {promociones.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{TIPOS[p.tipo]}</td>
                <td>{textoValor(p)}</td>
                <td>{p.fechaInicio}</td>
                <td>{p.fechaFin}</td>
                <td>{p.productos.map((x) => x.nombre).join(', ')}</td>
                <td>{p.activa ? 'Activa' : 'Desactivada'}</td>
                {esLider && (
                  <td>
                    <button onClick={() => editar(p)}>Editar</button>{' '}
                    {p.activa && (
                      <button onClick={() => desactivar(p)}>Desactivar</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}