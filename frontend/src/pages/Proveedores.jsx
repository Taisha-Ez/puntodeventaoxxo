import { useEffect, useState } from 'react'
import cliente from '../api/cliente'
import { useAuth } from '../context/AuthContext'

const VACIO = { nombre: '', telefono: '', email: '', rfc: '' }

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

function limpiar(form) {
  const datos = { nombre: form.nombre.trim() }
  if (form.telefono.trim()) datos.telefono = form.telefono.trim()
  if (form.email.trim()) datos.email = form.email.trim()
  if (form.rfc.trim()) datos.rfc = form.rfc.trim().toUpperCase()
  return datos
}

export default function Proveedores() {
  const { usuario } = useAuth()
  const esLider = usuario.rol === 'lider'

  const [proveedores, setProveedores] = useState([])
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    try {
      const { data } = await cliente.get('/proveedores')
      setProveedores(data)
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

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    try {
      const datos = limpiar(form)
      if (editandoId) {
        await cliente.patch(`/proveedores/${editandoId}`, datos)
      } else {
        await cliente.post('/proveedores', datos)
      }
      cancelar()
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function editar(p) {
    setEditandoId(p.id)
    setForm({
      nombre: p.nombre || '',
      telefono: p.telefono || '',
      email: p.email || '',
      rfc: p.rfc || '',
    })
    setError('')
  }

  function cancelar() {
    setEditandoId(null)
    setForm(VACIO)
  }

  async function desactivar(p) {
    if (!window.confirm(`¿Desactivar al proveedor "${p.nombre}"?`)) {
      return
    }
    setError('')
    try {
      await cliente.delete(`/proveedores/${p.id}`)
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  return (
    <div>
      <h1>Proveedores</h1>

      {esLider && (
        <form onSubmit={guardar} className="formulario">
          <input
            placeholder="Nombre *"
            value={form.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            maxLength={100}
            required
          />
          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => cambiar('telefono', e.target.value)}
            maxLength={20}
          />
          <input
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => cambiar('email', e.target.value)}
            maxLength={100}
          />
          <input
            placeholder="RFC (12 o 13 caracteres)"
            value={form.rfc}
            onChange={(e) => cambiar('rfc', e.target.value)}
            maxLength={13}
          />
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

      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>RFC</th>
              {esLider && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {proveedores.length === 0 && (
              <tr>
                <td colSpan={esLider ? 6 : 5}>No hay proveedores</td>
              </tr>
            )}
            {proveedores.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.telefono || '-'}</td>
                <td>{p.email || '-'}</td>
                <td>{p.rfc || '-'}</td>
                {esLider && (
                  <td>
                    <button onClick={() => editar(p)}>Editar</button>{' '}
                    <button onClick={() => desactivar(p)}>Desactivar</button>
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