export function mensajeError(err) {
  const mensaje = err.response?.data?.message
  if (Array.isArray(mensaje)) return mensaje.join(', ')
  return mensaje || 'No se pudo conectar con el servidor'
}

export const redondear = (valor) => Math.round(valor * 100) / 100

export function dinero(valor) {
  return `$${Number(valor).toFixed(2)}`
}

export function fechaHora(fecha) {
  return new Date(fecha).toLocaleString('es-MX')
}
