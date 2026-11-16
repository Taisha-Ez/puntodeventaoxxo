import { dinero, fechaHora, redondear } from './utils'

export default function Ticket({
  venta,
  titulo = 'Ticket de venta',
  etiquetaCerrar = 'Nueva venta',
  onCerrar,
  children,
}) {
  const cambio = redondear(venta.pagos.reduce((suma, p) => suma + Number(p.cambio), 0))

  return (
    <div className="pos-modal pos-modal-alto">
      <div className="pos-modal-caja">
        <div className="pos-modal-titulo">
          <h2>{titulo}</h2>
          <button className="pos-x" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className="pos-ticket">
          <p className="centrado">
            <strong>PUNTO DE VENTA</strong>
          </p>
          <p>
            Ticket #{venta.id} · {fechaHora(venta.fecha)}
          </p>
          <p>
            Caja {venta.turno?.caja?.numero ?? '-'} · Atendió: {venta.usuario?.nombre}
          </p>
          {venta.estado === 'CANCELADA' && <p className="pos-cancelado">VENTA CANCELADA</p>}
          <hr />
          {venta.detalles.map((d) => (
            <div key={d.id} className="pos-ticket-linea">
              <span>
                {d.cantidad} x {d.producto.nombre}
                <small>
                  {dinero(d.precioUnitario)} c/u
                  {d.promocion ? ` · ${d.promocion.nombre}` : ''}
                </small>
              </span>
              <span>{dinero(d.subtotal)}</span>
            </div>
          ))}
          <hr />
          <div className="pos-ticket-linea">
            <span>Subtotal</span>
            <span>{dinero(venta.subtotal)}</span>
          </div>
          <div className="pos-ticket-linea">
            <span>Descuento</span>
            <span>-{dinero(venta.descuento)}</span>
          </div>
          <div className="pos-ticket-linea total">
            <span>TOTAL</span>
            <span>{dinero(venta.total)}</span>
          </div>
          <hr />
          {venta.pagos.map((p) => (
            <div key={p.id} className="pos-ticket-linea">
              <span>{p.metodoPago.nombre}</span>
              <span>{dinero(p.monto)}</span>
            </div>
          ))}
          <div className="pos-ticket-linea">
            <span>Cambio</span>
            <span>{dinero(cambio)}</span>
          </div>
        </div>

        {children}
        <button className="pos-btn-principal" onClick={onCerrar}>
          {etiquetaCerrar}
        </button>
      </div>
    </div>
  )
}
