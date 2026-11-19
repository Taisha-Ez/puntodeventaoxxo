// Cuadrícula con todas las categorías para elegir una rápido desde el POS
export default function Categorias({ categorias, productos, onElegir, onCerrar }) {
  function contar(categoria) {
    return productos.filter((p) => p.categoria?.id === categoria.id).length
  }

  return (
    <div className="pos-modal">
      <div className="pos-modal-caja pos-modal-ancha">
        <div className="pos-modal-titulo">
          <h2>Categorías</h2>
          <button className="pos-x" onClick={onCerrar}>
            ✕
          </button>
        </div>

        {categorias.length === 0 ? (
          <p>No hay categorías registradas</p>
        ) : (
          <div className="pos-cat-grid">
            {categorias.map((c) => (
              <button key={c.id} className="pos-cat" onClick={() => onElegir(c)}>
                <span>{c.nombre}</span>
                <small>{contar(c)} productos</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
