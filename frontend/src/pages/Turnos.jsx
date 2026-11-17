import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cliente from '../api/cliente'

function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

const dinero = (v) => `$${Number(v || 0).toFixed(2)}`
const fechaHora = (f) => (f ? new Date(f).toLocaleString('es-MX') : '-')

function textoDiferencia(dif) {
  if (dif === null || dif === undefined) return '-'
  const n = Number(dif)
  if (n === 0) return 'Cuadra ($0.00)'
  return n > 0 ? `Sobrante ${dinero(n)}` : `Faltante ${dinero(Math.abs(n))}`
}

export default function Turnos() {
  const navigate = useNavigate()
  const [turnos, setTurnos] = useState([])
  const [corte, setCorte] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function cargar() {
    setCargando(true)
    setError('')
    try {
      const { data } = await cliente.get('/turnos-caja')
      setTurnos(data)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    cargar()
  }, [])

  async function verCorte(id) {
    setError('')
    try {
      const { data } = await cliente.get(`/turnos-caja/${id}`)
      setCorte(data)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  const resumen = corte?.resumen
  const turno = corte?.turno

  return (
    <div>
      <h1>Turnos de caja</h1>
      <p>Historial de aperturas y cortes. Las diferencias muestran faltantes o sobrantes de efectivo.</p>

      <div className="barra-busqueda">
        <button onClick={cargar}>Actualizar</button>
      </div>

      {error && <p style={{ color: '#c8102e' }}>{error}</p>}
      {cargando && <p>Cargando...</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Caja</th>
            <th>Cajero</th>
            <th>Apertura</th>
            <th>Cierre</th>
            <th>Fondo inicial</th>
            <th>Efectivo contado</th>
            <th>Diferencia</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {turnos.length === 0 && !cargando && (
            <tr>
              <td colSpan="10">No hay turnos</td>
            </tr>
          )}
          {turnos.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.caja?.numero}</td>
              <td>{t.usuario?.nombre}</td>
              <td>{fechaHora(t.fechaApertura)}</td>
              <td>{fechaHora(t.fechaCierre)}</td>
              <td>{dinero(t.montoInicial)}</td>
              <td>{t.montoFinal === null ? '-' : dinero(t.montoFinal)}</td>
              <td className={Number(t.diferencia) < 0 ? 'negativo' : ''}>
                {textoDiferencia(t.diferencia)}
              </td>
              <td>{t.estado}</td>
              <td>
                <button onClick={() => verCorte(t.id)}>Ver corte</button>{' '}
                <button onClick={() => navigate(`/ventas?turnoId=${t.id}`)}>Ventas</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {corte && resumen && (
        <div className="formulario">
          <h2>
            Corte del turno #{turno.id} · {turno.estado}
          </h2>
          <p>
            Caja {turno.caja?.numero} · {turno.usuario?.nombre}
          </p>
          <table className="tabla">
            <tbody>
              <tr>
                <td>Fondo inicial</td>
                <td>{dinero(turno.montoInicial)}</td>
              </tr>
              <tr>
                <td>Ventas realizadas</td>
                <td>{resumen.numVentas}</td>
              </tr>
              <tr>
                <td>Total vendido</td>
                <td>{dinero(resumen.totalVendido)}</td>
              </tr>
              <tr>
                <td>Efectivo por ventas</td>
                <td>{dinero(resumen.efectivoVentas)}</td>
              </tr>
              <tr>
                <td>Efectivo esperado en caja</td>
                <td>{dinero(resumen.efectivoEsperado)}</td>
              </tr>
              {turno.estado === 'CERRADO' && (
                <>
                  <tr>
                    <td>Efectivo contado</td>
                    <td>{dinero(turno.montoFinal)}</td>
                  </tr>
                  <tr>
                    <td>Diferencia</td>
                    <td>{textoDiferencia(turno.diferencia)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          <button onClick={() => setCorte(null)}>Cerrar</button>
        </div>
      )}
    </div>
  )
}
