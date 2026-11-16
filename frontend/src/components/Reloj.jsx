import { useEffect, useState } from 'react'

// Fecha y hora que se actualizan cada segundo
export default function Reloj() {
  const [ahora, setAhora] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return <span className="reloj">{ahora.toLocaleString('es-MX')}</span>
}
