import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import cliente from '../api/cliente'

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

const dinero = (v) => `$${Number(v || 0).toFixed(2)}`
const fechaHora = (f) => (f ? new Date(f).toLocaleString('es-MX') : '-')
const hoy = () => new Date().toLocaleDateString('en-CA') // AAAA-MM-DD

export default function Ventas() {
  const [params, setParams] = useSearchParams()
  const turnoId = params.get('turnoId') || ''

  // Si vienes de un turno se muestran todas sus ventas; si no, las de hoy
  const [fecha, setFecha] = useState(turnoId ? '' : hoy())
  const [ventas, setVentas] = useState([])
  const [venta, setVenta] = useState(null)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const { data } = await cliente.get('/ventas', {
        params: {
          ...(turnoId ? { turnoId } : {}),
          ...(fecha ? { fecha } : {}),
        },
      })
      setVentas(data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }, [turnoId, fecha])

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    cargar()
  }, [cargar])

  const pagadas = ventas.filter((v) => v.estado !== 'CANCELADA')
  const totalVendido = pagadas.reduce((suma, v) => suma + Number(v.total), 0)

  async function verVenta(id) {
    setError('')
    setExito('')
    try {
      const { data } = await cliente.get(`/ventas/${id}`)
      setVenta(data)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  async function cancelarVenta(id) {
    if (!window.confirm(`¿Cancelar la venta #${id}? Se regresará el stock.`)) return
    setError('')
    setExito('')
    try {
      await cliente.patch(`/ventas/${id}/cancelar`)
      setExito(`Venta #${id} cancelada`)
      setVenta(null)
      await cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function quitarTurno() {
    setParams({})
    setFecha(hoy())
  }

  return (
    <div>
      <h1>Historial de ventas</h1>

      <div className="barra-busqueda">
        {turnoId ? (
          <>
            <strong>Turno #{turnoId}</strong>{' '}
            <button onClick={quitarTurno}>Ver ventas de hoy</button>
          </>
        ) : null}
        <label>
          Fecha:{' '}
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        {fecha && <button onClick={() => setFecha('')}>Todas las fechas</button>}
        <button onClick={cargar}>Actualizar</button>
      </div>

      {error && <p style={{ color: '#c8102e' }}>{error}</p>}
      {exito && <p className="exito">{exito}</p>}
      {cargando && <p>Cargando...</p>}

      <p>
        <strong>{pagadas.length}</strong> ventas pagadas · Total vendido:{' '}
        <strong>{dinero(totalVendido)}</strong>
        {ventas.length >= 200 && ' (se muestran las 200 más recientes)'}
      </p>

      <table className="tabla">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Fecha</th>
            <th>Cajero</th>
            <th>Total</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 && !cargando && (
            <tr>
              <td colSpan="6">No hay ventas</td>
            </tr>
          )}
          {ventas.map((v) => (
            <tr key={v.id} className={v.estado === 'CANCELADA' ? 'fila-inactiva' : ''}>
              <td>#{v.id}</td>
              <td>{fechaHora(v.fecha)}</td>
              <td>{v.usuario?.nombre}</td>
              <td>{dinero(v.total)}</td>
              <td>{v.estado}</td>
              <td>
                <button onClick={() => verVenta(v.id)}>Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {venta && (
        <div className="formulario">
          <h2>
            Ticket #{venta.id} · {venta.estado}
          </h2>
          <p>
            {fechaHora(venta.fecha)} · Caja {venta.turno?.caja?.numero ?? '-'} · Atendió:{' '}
            {venta.usuario?.nombre}
          </p>

          <table className="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Promoción</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((d) => (
                <tr key={d.id}>
                  <td>{d.producto?.nombre}</td>
                  <td>{d.cantidad}</td>
                  <td>{dinero(d.precioUnitario)}</td>
                  <td>{d.promocion?.nombre ?? '-'}</td>
                  <td>{dinero(d.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Subtotal: {dinero(venta.subtotal)} · Descuento: -{dinero(venta.descuento)} ·{' '}
            <strong>Total: {dinero(venta.total)}</strong>
          </p>
          <p>
            Pagos:{' '}
            {venta.pagos
              .map((p) => `${p.metodoPago?.nombre} ${dinero(p.monto)}`)
              .join(' · ')}
          </p>

          {venta.estado === 'PAGADA' && (
            <button onClick={() => cancelarVenta(venta.id)}>Cancelar venta</button>
          )}{' '}
          <button onClick={() => setVenta(null)}>Cerrar</button>
        </div>
      )}
    </div>
  )
}
