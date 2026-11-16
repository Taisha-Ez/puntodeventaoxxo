import { useCallback, useEffect, useState } from 'react'
import cliente from '../api/cliente'

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

function fechaHora(fecha) {
  return fecha ? new Date(fecha).toLocaleString('es-MX') : '-'
}

export default function Devoluciones() {
  const [lista, setLista] = useState([])
  const [soloPendientes, setSoloPendientes] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const { data } = await cliente.get('/devoluciones', {
        params: soloPendientes ? { pendientes: true } : {},
      })
      setLista(data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }, [soloPendientes])

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    cargar()
  }, [cargar])

  async function autorizar(id) {
    if (!window.confirm('¿Autorizar esta devolución? Se regresará el producto al inventario.')) return
    setError('')
    setExito('')
    try {
      await cliente.patch(`/devoluciones/${id}/autorizar`)
      setExito(`Devolución #${id} autorizada`)
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function rechazar(id) {
    if (!window.confirm('¿Rechazar esta devolución?')) return
    setError('')
    setExito('')
    try {
      await cliente.delete(`/devoluciones/${id}`)
      setExito(`Devolución #${id} rechazada`)
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function esPendiente(d) {
    return d.estado
      ? String(d.estado).toUpperCase().startsWith('PEND')
      : soloPendientes
  }

  return (
    <div>
      <h1>Devoluciones</h1>
      <p>
        Las devoluciones hechas por un ayudante quedan pendientes hasta que un encargado las autorice.
      </p>

      <div className="barra-busqueda">
        <select
          value={soloPendientes ? 'pendientes' : 'todas'}
          onChange={(e) => setSoloPendientes(e.target.value === 'pendientes')}
        >
          <option value="pendientes">Solo pendientes</option>
          <option value="todas">Todas</option>
        </select>
        <button onClick={cargar}>Actualizar</button>
      </div>

      {error && <p style={{ color: '#c8102e' }}>{error}</p>}
      {exito && <p className="exito">{exito}</p>}
      {cargando && <p>Cargando...</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Ticket</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Motivo</th>
            <th>Solicitó</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 && !cargando && (
            <tr>
              <td colSpan="9">No hay devoluciones</td>
            </tr>
          )}
          {lista.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>#{d.venta?.id ?? d.ventaId}</td>
              <td>{d.producto?.nombre ?? d.productoId}</td>
              <td>{d.cantidad}</td>
              <td>{d.motivo}</td>
              <td>{d.usuario?.nombre ?? '-'}</td>
              <td>{fechaHora(d.fecha ?? d.createdAt)}</td>
              <td>{d.estado ?? (soloPendientes ? 'PENDIENTE' : '-')}</td>
              <td>
                {esPendiente(d) && (
                  <>
                    <button onClick={() => autorizar(d.id)}>Autorizar</button>{' '}
                    <button onClick={() => rechazar(d.id)}>Rechazar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
