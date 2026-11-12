import { useEffect, useState } from 'react'
import cliente from '../api/cliente'
import { useAuth } from '../context/AuthContext'

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

export default function Categorias() {
  const { usuario } = useAuth()
  const esLider = usuario.rol === 'lider'

  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    try {
      const { data } = await cliente.get('/categorias')
      setCategorias(data)
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
  async function guardar(e) {
    e.preventDefault()
    setError('')
    try {
      if (editandoId) {
        await cliente.patch(`/categorias/${editandoId}`, { nombre })
      } else {
        await cliente.post('/categorias', { nombre })
      }
      cancelar()
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function editar(categoria) {
    setEditandoId(categoria.id)
    setNombre(categoria.nombre)
    setError('')
  }

  function cancelar() {
    setEditandoId(null)
    setNombre('')
  }

  async function desactivar(categoria) {
    if (!window.confirm(`¿Desactivar la categoría "${categoria.nombre}"?`)) {
      return
    }
    setError('')
    try {
      await cliente.delete(`/categorias/${categoria.id}`)
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  return (
    <div>
      <h1>Categorías</h1>

      {esLider && (
        <form onSubmit={guardar} className="formulario">
          <input
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={60}
            required
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
              {esLider && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 && (
              <tr>
                <td colSpan={esLider ? 3 : 2}>No hay categorías</td>
              </tr>
            )}
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                {esLider && (
                  <td>
                    <button onClick={() => editar(c)}>Editar</button>{' '}
                    <button onClick={() => desactivar(c)}>Desactivar</button>
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