import { useState } from 'react'
import { dinero, redondear } from './utils'

const BILLETES = [20, 50, 100, 200, 500]

export default function Cobro({ total, metodos, onCancelar, onConfirmar }) {
  const efectivo = metodos.find((m) => m.nombre === 'efectivo')

  const [pagos, setPagos] = useState([])
  const [metodoId, setMetodoId] = useState(efectivo?.id ?? metodos[0]?.id ?? null)
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const pagado = redondear(pagos.reduce((suma, p) => suma + p.monto, 0))
  const falta = redondear(Math.max(total - pagado, 0))
  const sobra = redondear(Math.max(pagado - total, 0))
  const pagadoEnEfectivo = redondear(
    pagos.filter((p) => p.nombre === 'efectivo').reduce((suma, p) => suma + p.monto, 0)
  )
  // El cambio solo se puede dar con lo que se pagó en efectivo
  const puedeConfirmar = pagos.length > 0 && falta === 0 && sobra <= pagadoEnEfectivo

  function elegirBillete(valor) {
    if (efectivo) setMetodoId(efectivo.id)
    setMonto(String(valor))
  }

  function agregarPago(e) {
    e.preventDefault()
    setError('')
    const valor = monto === '' ? falta : Number(monto)
    if (!valor || valor <= 0) {
      setError('Escribe un monto mayor a 0')
      return
    }
    const metodo = metodos.find((m) => m.id === metodoId)
    if (!metodo) {
      setError('Elige un método de pago')
      return
    }
    setPagos([...pagos, { metodoPagoId: metodo.id, nombre: metodo.nombre, monto: redondear(valor) }])
    setMonto('')
  }

  function quitarPago(indice) {
    setPagos(pagos.filter((_, i) => i !== indice))
  }

  async function confirmar() {
    setError('')
    setEnviando(true)
    const mensaje = await onConfirmar(
      pagos.map((p) => ({ metodoPagoId: p.metodoPagoId, monto: p.monto }))
    )
    if (mensaje) {
      setError(mensaje)
      setEnviando(false)
    }
  }

  return (
    <div className="pos-modal">
      <div className="pos-modal-caja">
        <div className="pos-modal-titulo">
          <h2>Cobrar</h2>
          <button className="pos-x" onClick={onCancelar}>
            ✕
          </button>
        </div>

        <p className="pos-total-grande">Por pagar: {dinero(total)}</p>

        <div className="pos-metodos">
          {metodos.map((m) => (
            <button
              key={m.id}
              type="button"
              className={m.id === metodoId ? 'pos-metodo activo' : 'pos-metodo'}
              onClick={() => setMetodoId(m.id)}
            >
              {m.nombre}
            </button>
          ))}
        </div>

        <div className="pos-billetes">
          {BILLETES.map((b) => (
            <button key={b} type="button" onClick={() => elegirBillete(b)}>
              ${b}
            </button>
          ))}
        </div>

        <form onSubmit={agregarPago} className="pos-monto">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={falta > 0 ? `Monto (falta ${dinero(falta)})` : 'Monto'}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            autoFocus
          />
          <button type="submit">Agregar pago</button>
        </form>

        {pagos.length > 0 && (
          <ul className="pos-pagos">
            {pagos.map((p, i) => (
              <li key={i}>
                <span>
                  {p.nombre}: {dinero(p.monto)}
                </span>
                <button type="button" onClick={() => quitarPago(i)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="pos-resumen-pago">
          <p>
            <span>Pagado</span>
            <strong>{dinero(pagado)}</strong>
          </p>
          <p>
            <span>Falta</span>
            <strong>{dinero(falta)}</strong>
          </p>
          <p>
            <span>Cambio</span>
            <strong>{dinero(sobra)}</strong>
          </p>
        </div>

        {sobra > pagadoEnEfectivo && (
          <p className="pos-aviso">Con tarjeta o transferencia no se puede pagar de más</p>
        )}
        {error && <p className="pos-aviso">{error}</p>}

        <button
          className="pos-btn-principal"
          onClick={confirmar}
          disabled={!puedeConfirmar || enviando}
        >
          {enviando ? 'Procesando...' : 'Confirmar venta'}
        </button>
      </div>
    </div>
  )
}
