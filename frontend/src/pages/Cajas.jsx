import { useCallback, useEffect, useState } from 'react'
import cliente from '../api/cliente'

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

export default function Cajas() {
  const [cajas, setCajas] = useState([])
  const [numero, setNumero] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const cargar = useCallback(async () => {
    try {
      const { data } = await cliente.get('/cajas')
      setCajas(data)
      return data
    } catch (err) {
      setError(mensajeError(err))
      return []
    }
  }, [])

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    cargar()
  }, [cargar])

  function siguienteNumero(lista) {
    return lista.length ? Math.max(...lista.map((c) => c.numero)) + 1 : 1
  }

  function nuevo() {
    setEditandoId(null)
    setNumero(String(siguienteNumero(cajas)))
    setError('')
    setExito('')
  }

  function editar(caja) {
    setEditandoId(caja.id)
    setNumero(String(caja.numero))
    setError('')
    setExito('')
  }

  function cancelar() {
    setEditandoId(null)
    setNumero('')
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setExito('')
    try {
      if (editandoId) {
        await cliente.patch(`/cajas/${editandoId}`, { numero: Number(numero) })
        setExito('Caja actualizada')
      } else {
        await cliente.post('/cajas', { numero: Number(numero) })
        setExito(`Caja ${numero} creada. Ya aparece al abrir turno en el punto de venta.`)
      }
      cancelar()
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function desactivar(caja) {
    if (!window.confirm(`¿Desactivar la caja ${caja.numero}? Ya no aparecerá para abrir turno.`)) return
    setError('')
    setExito('')
    try {
      await cliente.delete(`/cajas/${caja.id}`)
      setExito(`Caja ${caja.numero} desactivada`)
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  const formularioAbierto = editandoId !== null || numero !== ''

  return (
    <div>
      <h1>Cajas</h1>
      <p>Las cajas que crees aquí aparecen en el punto de venta al abrir turno.</p>

      {error && <p style={{ color: '#c8102e' }}>{error}</p>}
      {exito && <p className="exito">{exito}</p>}

      {!formularioAbierto && <button onClick={nuevo}>+ Nueva caja</button>}

      {formularioAbierto && (
        <form onSubmit={guardar} className="formulario">
          <h2>{editandoId ? 'Editar caja' : 'Nueva caja'}</h2>
          <label>Número de caja</label>
          <input
            type="number"
            min="1"
            step="1"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
            autoFocus
          />
          <p>
            <button type="submit">Guardar</button>{' '}
            <button type="button" onClick={cancelar}>
              Cancelar
            </button>
          </p>
        </form>
      )}

      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Caja</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cajas.length === 0 && (
            <tr>
              <td colSpan="3">No hay cajas activas</td>
            </tr>
          )}
          {cajas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>Caja {c.numero}</td>
              <td>
                <button onClick={() => editar(c)}>Editar</button>
                <button onClick={() => desactivar(c)}>Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
