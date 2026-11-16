/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import cliente from '../../api/cliente'
import { mensajeError } from './utils'

export default function AbrirTurno({ nombre, onAbierto, onSalir }) {
  const [cajas, setCajas] = useState([])
  const [cajaId, setCajaId] = useState('')
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function cargar() {
      try {
        const { data } = await cliente.get('/cajas')
        setCajas(data)
      } catch (err) {
        setError(mensajeError(err))
      }
    }
    cargar()
  }, [])

  async function abrir(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await cliente.post('/turnos-caja/abrir', {
        cajaId: Number(cajaId),
        montoInicial: Number(monto),
      })
      await onAbierto()
    } catch (err) {
      setError(mensajeError(err))
      setEnviando(false)
    }
  }

  return (
    <div className="pos-centro">
      <form onSubmit={abrir} className="pos-tarjeta">
        <h1>Abrir turno</h1>
        <p>Le atiende: {nombre}</p>

        <label>Caja</label>
        <select value={cajaId} onChange={(e) => setCajaId(e.target.value)} required>
          <option value="">Elige una caja</option>
          {cajas.map((c) => (
            <option key={c.id} value={c.id}>
              Caja {c.numero}
            </option>
          ))}
        </select>

        <label>Fondo inicial en efectivo</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />

        {error && <p className="pos-aviso">{error}</p>}

        <button type="submit" className="pos-btn-principal" disabled={enviando}>
          {enviando ? 'Abriendo...' : 'Abrir turno'}
        </button>
        <button type="button" className="pos-btn-sec" onClick={onSalir}>
          Volver al menú
        </button>
      </form>
    </div>
  )
}
