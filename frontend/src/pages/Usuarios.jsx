import { useEffect, useState } from 'react'
import cliente from '../api/cliente'
import { useAuth } from '../context/AuthContext'

const VACIO = { nombre: '', usuario: '', password: '', rolId: '' }

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

// Mismas reglas que valida el backend. Regresa la lista de lo que falta.
function validar(form, editando) {
  const faltas = []
  const usuario = form.usuario.trim()
  if (!form.nombre.trim()) faltas.push('El nombre es obligatorio')
  if (usuario.length < 3) faltas.push('El usuario debe tener al menos 3 caracteres')
  if (usuario && !/^[a-zA-Z0-9._-]+$/.test(usuario)) {
    faltas.push('El usuario solo puede tener letras, números, punto, guion y guion bajo')
  }
  if (!editando && !form.password) faltas.push('La contraseña es obligatoria')
  if (form.password && form.password.length < 6) {
    faltas.push('La contraseña debe tener al menos 6 caracteres')
  }
  if (!form.rolId) faltas.push('Selecciona un rol')
  return faltas
}

export default function Usuarios() {
  const { usuario: actual } = useAuth()

  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  async function cargarUsuarios() {
    try {
      const { data } = await cliente.get('/usuarios')
      setUsuarios(data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  async function cargarRoles() {
    try {
      const { data } = await cliente.get('/roles')
      setRoles(data)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    cargarUsuarios()
    cargarRoles()
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    const faltas = validar(form, editandoId)
    if (faltas.length > 0) {
      setError(faltas.join(', '))
      window.alert('No cumple los requisitos mínimos:\n\n- ' + faltas.join('\n- '))
      return
    }
    const datos = {
      nombre: form.nombre.trim(),
      usuario: form.usuario.trim(),
      rolId: Number(form.rolId),
    }
    if (form.password) datos.password = form.password
    try {
      if (editandoId) {
        await cliente.patch(`/usuarios/${editandoId}`, datos)
      } else {
        await cliente.post('/usuarios', datos)
      }
      cancelar()
      await cargarUsuarios()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function editar(u) {
    setEditandoId(u.id)
    setForm({
      nombre: u.nombre,
      usuario: u.usuario,
      password: '',
      rolId: u.rol ? String(u.rol.id) : '',
    })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(VACIO)
  }

  async function desactivar(u) {
    if (!window.confirm(`¿Desactivar al usuario "${u.usuario}"?`)) {
      return
    }
    setError('')
    try {
      await cliente.delete(`/usuarios/${u.id}`)
      await cargarUsuarios()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function reactivar(u) {
    setError('')
    try {
      await cliente.patch(`/usuarios/${u.id}`, { activo: true })
      await cargarUsuarios()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  return (
    <div>
      <h1>Usuarios</h1>

      <form onSubmit={guardar} className="formulario" noValidate>
        <input
          placeholder="Nombre completo *"
          value={form.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
          maxLength={100}
          required
        />
        <input
          placeholder="Usuario * (mín. 3)"
          value={form.usuario}
          onChange={(e) => cambiar('usuario', e.target.value)}
          minLength={3}
          maxLength={50}
          pattern="[a-zA-Z0-9._\-]+"
          title="Solo letras, números, punto, guion y guion bajo"
          required
        />
        <input
          type="password"
          placeholder={
            editandoId ? 'Nueva contraseña (opcional)' : 'Contraseña * (mín. 6)'
          }
          value={form.password}
          onChange={(e) => cambiar('password', e.target.value)}
          minLength={6}
          maxLength={72}
          required={!editandoId}
        />
        <select
          value={form.rolId}
          onChange={(e) => cambiar('rolId', e.target.value)}
          required
        >
          <option value="">Rol *</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
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

      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={5}>No hay usuarios</td>
              </tr>
            )}
            {usuarios.map((u) => (
              <tr key={u.id} className={u.activo ? '' : 'fila-inactiva'}>
                <td>{u.nombre}</td>
                <td>{u.usuario}</td>
                <td>{u.rol?.nombre}</td>
                <td>{u.activo ? 'Activo' : 'Desactivado'}</td>
                <td>
                  <button onClick={() => editar(u)}>Editar</button>{' '}
                  {u.id !== actual.id &&
                    (u.activo ? (
                      <button onClick={() => desactivar(u)}>Desactivar</button>
                    ) : (
                      <button onClick={() => reactivar(u)}>Reactivar</button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}