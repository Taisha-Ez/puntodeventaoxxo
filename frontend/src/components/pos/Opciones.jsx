import { useState } from 'react'
import cliente from '../../api/cliente'
import Ticket from './Ticket'
import { dinero, fechaHora, mensajeError } from './utils'

const TITULOS = {
  menu: 'Venta',
  corteX: 'Corte X',
  corteZ: 'Corte Z (cerrar turno)',
  resultadoZ: 'Turno cerrado',
  tickets: 'Consulta de tickets',
  devolucion: 'Devolución',
}

export default function Opciones({
  usuario,
  hayVentaEnCurso,
  onCerrar,
  onMenuPrincipal,
  onInventario,
  onLogout,
  onTurnoCerrado,
  onVentaCambiada,
}) {
  const [vista, setVista] = useState('menu')
  const [datos, setDatos] = useState(null)
  const [ventas, setVentas] = useState([])
  const [venta, setVenta] = useState(null)
  const [montoFinal, setMontoFinal] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [folio, setFolio] = useState('')
  const [ventaDev, setVentaDev] = useState(null)
  const [productoDev, setProductoDev] = useState('')
  const [cantidadDev, setCantidadDev] = useState('1')
  const [motivoDev, setMotivoDev] = useState('')
  const [exito, setExito] = useState('')

  const esEncargado = ['encargado', 'lider'].includes(usuario.rol)

  async function abrirCorteX() {
    setError('')
    setCargando(true)
    try {
      const { data } = await cliente.get('/turnos-caja/mi-turno')
      setDatos(data)
      setVista('corteX')
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  function abrirCorteZ() {
    setError('')
    if (hayVentaEnCurso) {
      setError('Termina o elimina la venta en curso antes de hacer el corte Z')
      return
    }
    setMontoFinal('')
    setVista('corteZ')
  }

  async function cerrarTurno(e) {
    e.preventDefault()
    if (!window.confirm('¿Cerrar el turno? Ya no podrás vender hasta abrir otro.')) return
    setError('')
    setCargando(true)
    try {
      const { data } = await cliente.post('/turnos-caja/cerrar', {
        montoFinal: Number(montoFinal),
      })
      setDatos(data)
      setVista('resultadoZ')
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  async function cargarTickets() {
    const { data } = await cliente.get('/ventas/mi-turno')
    setVentas(data)
  }

  async function abrirTickets() {
    setError('')
    setCargando(true)
    try {
      await cargarTickets()
      setVista('tickets')
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  async function verTicket(id) {
    setError('')
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
    try {
      await cliente.patch(`/ventas/${id}/cancelar`)
      setVenta(null)
      await cargarTickets()
      await onVentaCambiada()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  function abrirDevolucion() {
    setError('')
    setExito('')
    setFolio('')
    setVentaDev(null)
    setProductoDev('')
    setCantidadDev('1')
    setMotivoDev('')
    setVista('devolucion')
  }

  async function buscarVentaDev(e) {
    e.preventDefault()
    setError('')
    setExito('')
    setVentaDev(null)
    setCargando(true)
    try {
      const { data } = await cliente.get(`/ventas/${Number(folio)}`)
      if (data.estado === 'CANCELADA') {
        setError('Esa venta está cancelada, no se puede devolver')
      } else {
        setVentaDev(data)
        const primero = data.detalles[0]
        setProductoDev(primero ? String(idProducto(primero)) : '')
      }
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  function idProducto(detalle) {
    return detalle.producto?.id ?? detalle.productoId
  }

  async function enviarDevolucion(e) {
    e.preventDefault()
    setError('')
    setExito('')
    setCargando(true)
    try {
      const { data } = await cliente.post('/devoluciones', {
        ventaId: ventaDev.id,
        productoId: Number(productoDev),
        cantidad: Number(cantidadDev),
        motivo: motivoDev.trim(),
      })
      const pendiente = data.estado
        ? String(data.estado).toUpperCase().startsWith('PEND')
        : !esEncargado
      setExito(
        pendiente
          ? 'Devolución enviada. Un encargado debe autorizarla'
          : 'Devolución registrada y autorizada'
      )
      setVentaDev(null)
      setFolio('')
      setMotivoDev('')
      await onVentaCambiada()
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  function cerrarSesion() {
    setError('')
    if (hayVentaEnCurso) {
      setError('Termina o elimina la venta en curso antes de cerrar sesión')
      return
    }
    onLogout()
  }

  const opciones = [
    { icono: '🏠', texto: 'Menú principal', accion: onMenuPrincipal },
    { icono: '✂️', texto: 'Corte X', accion: abrirCorteX },
    { icono: '🧮', texto: 'Corte Z', accion: abrirCorteZ },
    { icono: '🧾', texto: 'Consulta de tickets', accion: abrirTickets },
    { icono: '↩️', texto: 'Devolución', accion: abrirDevolucion },
    ...(esEncargado
      ? [{ icono: '📋', texto: 'Inventario operativo', accion: onInventario }]
      : []),
    { icono: '👤', texto: 'Cerrar sesión', accion: cerrarSesion },
  ]

  const resumen = datos?.resumen
  const turno = datos?.turno

  return (
    <div className="pos-modal">
      <div className="pos-modal-caja pos-modal-ancha">
        <div className="pos-modal-titulo">
          <h2>{TITULOS[vista]}</h2>
          {vista !== 'resultadoZ' && (
            <button className="pos-x" onClick={onCerrar}>
              ✕
            </button>
          )}
        </div>

        {error && <p className="pos-aviso">{error}</p>}
        {exito && <p className="pos-exito">{exito}</p>}
        {cargando && <p>Cargando...</p>}

        {vista === 'menu' && (
          <div className="pos-menu">
            {opciones.map((o) => (
              <button key={o.texto} className="pos-menu-item" onClick={o.accion}>
                <span className="pos-menu-icono">{o.icono}</span>
                {o.texto}
              </button>
            ))}
          </div>
        )}

        {vista === 'corteX' && resumen && (
          <div>
            <p>Resumen del turno actual (el turno sigue abierto).</p>
            <div className="pos-resumen-pago">
              <p>
                <span>Fondo inicial</span>
                <strong>{dinero(turno.montoInicial)}</strong>
              </p>
              <p>
                <span>Ventas realizadas</span>
                <strong>{resumen.numVentas}</strong>
              </p>
              <p>
                <span>Total vendido</span>
                <strong>{dinero(resumen.totalVendido)}</strong>
              </p>
              <p>
                <span>Devoluciones ({resumen.numDevoluciones ?? 0})</span>
                <strong>-{dinero(resumen.totalDevoluciones ?? 0)}</strong>
              </p>
              <p>
                <span>Total neto</span>
                <strong>{dinero(resumen.totalNeto ?? resumen.totalVendido)}</strong>
              </p>
              <p>
                <span>Efectivo por ventas</span>
                <strong>{dinero(resumen.efectivoVentas)}</strong>
              </p>
              <p>
                <span>Efectivo esperado en caja</span>
                <strong>{dinero(resumen.efectivoEsperado)}</strong>
              </p>
            </div>
            <button className="pos-btn-sec" onClick={() => setVista('menu')}>
              ← Volver
            </button>
          </div>
        )}

        {vista === 'corteZ' && (
          <form onSubmit={cerrarTurno} className="pos-formulario">
            <p>Cuenta el efectivo que hay en la caja y escríbelo para cerrar el turno.</p>
            <label>Efectivo contado</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={montoFinal}
              onChange={(e) => setMontoFinal(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" className="pos-btn-principal" disabled={cargando}>
              Cerrar turno
            </button>
            <button type="button" className="pos-btn-sec" onClick={() => setVista('menu')}>
              ← Volver
            </button>
          </form>
        )}

        {vista === 'resultadoZ' && resumen && (
          <div>
            <div className="pos-resumen-pago">
              <p>
                <span>Ventas realizadas</span>
                <strong>{resumen.numVentas}</strong>
              </p>
              <p>
                <span>Total vendido</span>
                <strong>{dinero(resumen.totalVendido)}</strong>
              </p>
              <p>
                <span>Devoluciones ({resumen.numDevoluciones ?? 0})</span>
                <strong>-{dinero(resumen.totalDevoluciones ?? 0)}</strong>
              </p>
              <p>
                <span>Total neto</span>
                <strong>{dinero(resumen.totalNeto ?? resumen.totalVendido)}</strong>
              </p>
              <p>
                <span>Efectivo esperado</span>
                <strong>{dinero(resumen.efectivoEsperado)}</strong>
              </p>
              <p>
                <span>Efectivo contado</span>
                <strong>{dinero(turno.montoFinal)}</strong>
              </p>
              <p>
                <span>
                  {turno.diferencia > 0 ? 'Sobrante' : turno.diferencia < 0 ? 'Faltante' : 'Diferencia'}
                </span>
                <strong>{dinero(Math.abs(turno.diferencia))}</strong>
              </p>
            </div>
            <button className="pos-btn-principal" onClick={onTurnoCerrado}>
              Terminar
            </button>
          </div>
        )}

        {vista === 'devolucion' && (
          <div>
            <form onSubmit={buscarVentaDev} className="pos-formulario">
              <label>Número de ticket</label>
              <input
                type="number"
                min="1"
                placeholder="Ej. 15"
                value={folio}
                onChange={(e) => setFolio(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" className="pos-btn-sec" disabled={cargando}>
                Buscar venta
              </button>
            </form>

            {ventaDev && (
              <form onSubmit={enviarDevolucion} className="pos-formulario" style={{ marginTop: 14 }}>
                <p>
                  Ticket #{ventaDev.id} · {fechaHora(ventaDev.fecha)} · Total {dinero(ventaDev.total)}
                </p>
                <label>Producto a devolver</label>
                <select value={productoDev} onChange={(e) => setProductoDev(e.target.value)}>
                  {ventaDev.detalles.map((d) => (
                    <option key={d.id} value={idProducto(d)}>
                      {d.cantidad} x {d.producto.nombre} ({dinero(d.subtotal)})
                    </option>
                  ))}
                </select>
                <label>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidadDev}
                  onChange={(e) => setCantidadDev(e.target.value)}
                  required
                />
                <label>Motivo</label>
                <input
                  type="text"
                  placeholder="Ej. Producto en mal estado"
                  value={motivoDev}
                  onChange={(e) => setMotivoDev(e.target.value)}
                  required
                />
                <button type="submit" className="pos-btn-principal" disabled={cargando}>
                  Registrar devolución
                </button>
              </form>
            )}

            <button className="pos-btn-sec" style={{ marginTop: 10 }} onClick={() => setVista('menu')}>
              ← Volver
            </button>
          </div>
        )}

        {vista === 'tickets' && (
          <div>
            <div className="pos-lista">
              {ventas.length === 0 && <p>Aún no hay ventas en este turno</p>}
              {ventas.map((v) => (
                <button key={v.id} className="pos-fila" onClick={() => verTicket(v.id)}>
                  <span>
                    Ticket #{v.id}
                    <small>
                      {fechaHora(v.fecha)}
                      {v.estado === 'CANCELADA' ? ' · CANCELADA' : ''}
                    </small>
                  </span>
                  <strong>{dinero(v.total)}</strong>
                </button>
              ))}
            </div>
            <button className="pos-btn-sec" onClick={() => setVista('menu')}>
              ← Volver
            </button>
          </div>
        )}
      </div>

      {venta && (
        <Ticket
          venta={venta}
          titulo={`Ticket #${venta.id}`}
          etiquetaCerrar="Cerrar"
          onCerrar={() => setVenta(null)}
        >
          {esEncargado && venta.estado === 'PAGADA' && (
            <button className="pos-btn-peligro" onClick={() => cancelarVenta(venta.id)}>
              Cancelar venta
            </button>
          )}
        </Ticket>
      )}
    </div>
  )
}
