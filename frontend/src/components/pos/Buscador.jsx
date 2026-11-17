import { useState } from 'react'
import { dinero } from './utils'

// Si no recibe onElegir, solo sirve para consultar precios
export default function Buscador({ titulo, productos, onElegir, onCerrar }) {
  const [texto, setTexto] = useState('')

  const busqueda = texto.trim().toLowerCase()
  const visibles = productos
    .filter(
      (p) =>
        !busqueda ||
        p.nombre.toLowerCase().includes(busqueda) ||
        p.codigoBarras.includes(busqueda)
    )
    .slice(0, 50)

  return (
    <div className="pos-modal">
      <div className="pos-modal-caja pos-modal-ancha">
        <div className="pos-modal-titulo">
          <h2>{titulo}</h2>
          <button className="pos-x" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <input
          className="pos-buscador"
          placeholder="Escribe el nombre o el código"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoFocus
        />

        <div className="pos-lista">
          {visibles.length === 0 && <p>No hay productos</p>}
          {visibles.map((p) => (
            <button
              key={p.id}
              className="pos-fila"
              onClick={onElegir ? () => onElegir(p) : undefined}
              disabled={onElegir ? p.stockActual <= 0 : false}
            >
              <span>
                {p.nombre}
                <small>
                  {p.codigoBarras} · Stock: {p.stockActual}
                </small>
              </span>
              <strong>{dinero(p.precioVenta)}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
