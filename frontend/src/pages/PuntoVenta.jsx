/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cliente from '../api/cliente'
import { useAuth } from '../context/AuthContext'
import AbrirTurno from '../components/pos/AbrirTurno'
import Buscador from '../components/pos/Buscador'
import Categorias from '../components/pos/Categorias'
import Cobro from '../components/pos/Cobro'
import Opciones from '../components/pos/Opciones'
import Ticket from '../components/pos/Ticket'
import { dinero, mensajeError, redondear } from '../components/pos/utils'
import './PuntoVenta.css'

// Misma regla que usa el backend para escoger la mejor promoción de cada producto
function mejorDescuento(producto, cantidad, promos) {
  const precio = Number(producto.precioVenta)
  let mejor = 0
  for (const promo of promos) {
    if (!promo.productos.some((p) => p.id === producto.id)) continue
    const valor = Number(promo.valor)
    let descuento = 0
    if (promo.tipo === 'PORCENTAJE') {
      descuento = precio * cantidad * (valor / 100)
    } else if (promo.tipo === 'PRECIO_ESPECIAL' && valor < precio) {
      descuento = (precio - valor) * cantidad
    } else if (promo.tipo === 'DOS_POR_UNO') {
      descuento = Math.floor(cantidad / 2) * precio
    }
    descuento = redondear(descuento)
    if (descuento > mejor) mejor = descuento
  }
  return mejor
}

function textoPromo(promo) {
  if (promo.tipo === 'DOS_POR_UNO') return '2 x 1'
  if (promo.tipo === 'PORCENTAJE') return `${Number(promo.valor)}% de descuento`
  return `A SÓLO ${dinero(promo.valor)} c/u`
}

export default function PuntoVenta() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [estado, setEstado] = useState('cargando')
  const [errorGeneral, setErrorGeneral] = useState('')
  const [turno, setTurno] = useState(null)
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [promos, setPromos] = useState([])
  const [metodos, setMetodos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [seleccion, setSeleccion] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [aviso, setAviso] = useState('')
  const [modal, setModal] = useState(null)
  const [categoriaSel, setCategoriaSel] = useState(null)
  const [ticket, setTicket] = useState(null)
  const [ahora, setAhora] = useState(new Date())
  const [promoIdx, setPromoIdx] = useState(0)

  async function cargarTurno() {
    try {
      const { data } = await cliente.get('/turnos-caja/mi-turno')
      setTurno(data.turno)
      setEstado('listo')
    } catch (err) {
      if (err.response?.status === 404) {
        setTurno(null)
        setEstado('sin-turno')
      } else {
        setErrorGeneral(mensajeError(err))
        setEstado('error')
      }
    }
  }

  async function cargarProductos() {
    try {
      const { data } = await cliente.get('/productos')
      setProductos(data)
    } catch (err) {
      setAviso(mensajeError(err))
    }
  }

  async function cargarCatalogo() {
    try {
      const [prods, cats, vigentes, mets] = await Promise.all([
        cliente.get('/productos'),
        cliente.get('/categorias'),
        cliente.get('/promociones/vigentes'),
        cliente.get('/metodos-pago'),
      ])
      setProductos(prods.data)
      setCategorias(cats.data)
      setPromos(vigentes.data)
      setMetodos(mets.data.filter((m) => m.activo !== false))
    } catch (err) {
      setAviso(mensajeError(err))
    }
  }

  useEffect(() => {
    cargarTurno()
    cargarCatalogo()
  }, [])

  // Long polling: el servidor responde cuando hay un cambio (venta, cancelación,
  // compra, etc.) o cada ~25 s; en cada cambio se vuelve a cargar el catálogo.
  useEffect(() => {
    let activo = true
    let version = 0
    const controlador = new AbortController()

    async function escuchar() {
      while (activo) {
        try {
          const { data } = await cliente.get('/cambios/esperar', {
            params: { version },
            signal: controlador.signal,
          })
          if (!activo) break
          if (version !== 0 && data.version !== version) await cargarCatalogo()
          version = data.version
        } catch {
          if (!activo) break
          await new Promise((r) => setTimeout(r, 3000))
        }
      }
    }

    escuchar()
    return () => {
      activo = false
      controlador.abort()
    }
  }, [])

  useEffect(() => {
    const reloj =setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(reloj)
  }, [])

  useEffect(() => {
    if (promos.length < 2) return
    const rotar = setInterval(() => setPromoIdx((i) => (i + 1) % promos.length), 5000)
    return () => clearInterval(rotar)
  }, [promos])

  useEffect(() => {
    if (estado === 'listo' && !modal && !ticket) inputRef.current?.focus()
  }, [estado, modal, ticket])

  // Cálculo del carrito (el backend vuelve a calcularlo al cobrar)
  const lineas = carrito.map((l) => {
    const bruto = redondear(Number(l.producto.precioVenta) * l.cantidad)
    const descuento = mejorDescuento(l.producto, l.cantidad, promos)
    return { ...l, bruto, descuento, total: redondear(bruto - descuento) }
  })
  const subtotal = redondear(lineas.reduce((suma, l) => suma + l.bruto, 0))
  const descuentoTotal = redondear(lineas.reduce((suma, l) => suma + l.descuento, 0))
  const total = redondear(subtotal - descuentoTotal)

  function agregar(producto, cantidad = 1) {
    const existente = carrito.find((l) => l.producto.id === producto.id)
    const nueva = (existente ? existente.cantidad : 0) + cantidad
    if (nueva > producto.stockActual) {
      setAviso(`Stock insuficiente de "${producto.nombre}": hay ${producto.stockActual} piezas`)
      return
    }
    setAviso('')
    if (existente) {
      setCarrito(carrito.map((l) => (l.producto.id === producto.id ? { ...l, cantidad: nueva } : l)))
    } else {
      setCarrito([...carrito, { producto, cantidad: nueva }])
    }
    setSeleccion(producto.id)
  }

  // Escribir el código y Enter. También sirve "3*código" para agregar 3 piezas
  function capturar(e) {
    e.preventDefault()
    const texto = codigo.trim()
    if (!texto) return
    let cantidad = 1
    let clave = texto
    const multiple = texto.match(/^(\d+)\*(.+)$/)
    if (multiple) {
      cantidad = parseInt(multiple[1], 10)
      clave = multiple[2]
    }
    setCodigo('')
    if (cantidad < 1) {
      setAviso('La cantidad debe ser al menos 1')
      return
    }
    const producto = productos.find((p) => p.codigoBarras === clave)
    if (!producto) {
      setAviso(`No existe un producto con el código "${clave}"`)
      return
    }
    agregar(producto, cantidad)
  }

  function repetir() {
    const linea = carrito.find((l) => l.producto.id === seleccion) ?? carrito[carrito.length - 1]
    if (linea) agregar(linea.producto, 1)
  }

  function eliminar() {
    const id = seleccion ?? carrito[carrito.length - 1]?.producto.id
    if (id == null) return
    const nuevo = carrito.filter((l) => l.producto.id !== id)
    setCarrito(nuevo)
    setSeleccion(nuevo.length > 0 ? nuevo[nuevo.length - 1].producto.id : null)
    setAviso('')
  }

  function elegirDeLista(producto) {
    agregar(producto, 1)
    setModal(null)
  }

  function abrirCategoria(categoria) {
    setCategoriaSel(categoria)
    setModal('categoria')
  }

  // Al cerrar los productos de una categoría se regresa a la lista de categorías
  function cerrarCategoria() {
    setModal('categorias')
  }

  function irACobrar() {
    if (carrito.length === 0) {
      setAviso('Agrega al menos un artículo')
      return
    }
    setAviso('')
    setModal('cobro')
  }

  // Devuelve '' si todo salió bien, o el mensaje de error para mostrarlo en el cobro
  async function cobrar(pagos) {
    try {
      const { data } = await cliente.post('/ventas', {
        detalles: carrito.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })),
        pagos,
      })
      setTicket(data)
      setCarrito([])
      setSeleccion(null)
      setModal(null)
      await cargarProductos()
      return ''
    } catch (err) {
      return mensajeError(err)
    }
  }

  function turnoCerrado() {
    setModal(null)
    setCarrito([])
    setSeleccion(null)
    setTurno(null)
    setEstado('sin-turno')
  }

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  if (estado === 'cargando') {
    return <div className="pos-centro">Cargando...</div>
  }

  if (estado === 'error') {
    return (
      <div className="pos-centro">
        <div className="pos-tarjeta">
          <p className="pos-aviso">{errorGeneral}</p>
          <button className="pos-btn-principal" onClick={cargarTurno}>
            Reintentar
          </button>
          <button className="pos-btn-sec" onClick={() => navigate('/')}>
            Volver al menú
          </button>
        </div>
      </div>
    )
  }

  if (estado === 'sin-turno') {
    return (
      <AbrirTurno nombre={usuario.nombre} onAbierto={cargarTurno} onSalir={() => navigate('/')} />
    )
  }

  const hayMarcado = carrito.some((l) => l.producto.id === seleccion)
  const claseAccion = hayMarcado ? 'pos-boton pos-amarillo' : 'pos-boton pos-gris'

  const promo = promos.length > 0 ? promos[promoIdx % promos.length] : null

  return (
    <div className="pos">
      <div className="pos-top">
        <span className="pos-logo">PUNTO DE VENTA</span>
        <span>Caja: {turno?.caja?.numero ?? '-'}</span>
        <span>{ahora.toLocaleString('es-MX')}</span>
        <span>Le atiende: {usuario.nombre}</span>
      </div>

      <div className="pos-cuerpo">
        <div className="pos-izq">
          <label htmlFor="pos-codigo">Captura el código del artículo:</label>
          <form onSubmit={capturar}>
            <input
              id="pos-codigo"
              ref={inputRef}
              className="pos-codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              autoComplete="off"
            />
          </form>
          {aviso && <p className="pos-aviso">{aviso}</p>}

          <div className="pos-articulos">
            <div className="pos-art-head">
              <span>ARTÍCULOS</span>
              <span>Cantidad</span>
              <span>Total</span>
            </div>
            <div className="pos-art-body">
              {lineas.map((l) => (
                <div
                  key={l.producto.id}
                  className={l.producto.id === seleccion ? 'pos-linea activa' : 'pos-linea'}
                  onClick={() => setSeleccion(l.producto.id)}
                >
                  <span>
                    {l.producto.nombre}
                    <small>
                      {l.producto.codigoBarras} · {dinero(l.producto.precioVenta)} c/u
                    </small>
                  </span>
                  <span>{l.cantidad}</span>
                  <span>
                    {dinero(l.total)}
                    {l.descuento > 0 && <small className="pos-desc">Desc. -{dinero(l.descuento)}</small>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pos-pagar">
            <span>Por pagar (M.N.): {dinero(total)}</span>
            <button className="pos-btn-cobrar" onClick={irACobrar}>
              $(+)
            </button>
          </div>
        </div>

        <div className="pos-der">
          <div className="pos-promo">
            {promo ? (
              <>
                <p className="pos-promo-grande">{textoPromo(promo)}</p>
                <p className="pos-promo-nombre">{promo.nombre}</p>
                <p className="pos-promo-productos">
                  {promo.productos.map((p) => p.nombre).join(', ')}
                </p>
                <small>Vigente hasta el {promo.fechaFin}</small>
              </>
            ) : (
              <p>Sin promociones vigentes hoy</p>
            )}
          </div>

          <div className="pos-resumen">
            <p>
              <span>Artículos</span>
              <strong>{carrito.reduce((suma, l) => suma + l.cantidad, 0)}</strong>
            </p>
            <p>
              <span>Subtotal</span>
              <strong>{dinero(subtotal)}</strong>
            </p>
            <p>
              <span>Descuento</span>
              <strong>-{dinero(descuentoTotal)}</strong>
            </p>
          </div>

          <div className="pos-botones-der">
            <button className="pos-boton pos-amarillo" onClick={() => setModal('buscar')}>
              Desc.
            </button>
            <button className="pos-boton pos-amarillo" onClick={() => setModal('precio')}>
              Precio
            </button>
            <button className="pos-boton pos-amarillo" onClick={() => setModal('opciones')}>
              Opciones
            </button>
          </div>
        </div>
      </div>

      <div className="pos-botones">
        <button className={claseAccion} onClick={repetir} disabled={carrito.length === 0}>
          Repetir
        </button>
        <button className={claseAccion} onClick={eliminar} disabled={carrito.length === 0}>
          Eliminar
        </button>
        <button className="pos-boton pos-rojo" onClick={() => setModal('categorias')}>
          ☰ Categorías
        </button>
      </div>

      {modal === 'cobro' && (
        <Cobro
          total={total}
          metodos={metodos}
          onCancelar={() => setModal(null)}
          onConfirmar={cobrar}
        />
      )}
      {modal === 'buscar' && (
        <Buscador
          titulo="Buscar por descripción"
          productos={productos}
          onElegir={elegirDeLista}
          onCerrar={() => setModal(null)}
        />
      )}
      {modal === 'precio' && (
        <Buscador titulo="Consulta de precio" productos={productos} onCerrar={() => setModal(null)} />
      )}
      {modal === 'categoria' && categoriaSel && (
        <Buscador
          titulo={categoriaSel.nombre}
          productos={productos.filter((p) => p.categoria?.id === categoriaSel.id)}
          onElegir={elegirDeLista}
          onCerrar={cerrarCategoria}
        />
      )}
      {modal === 'categorias' && (
        <Categorias
          categorias={categorias}
          productos={productos}
          onElegir={abrirCategoria}
          onCerrar={() => setModal(null)}
        />
      )}
      {modal === 'opciones' && (
        <Opciones
          usuario={usuario}
          hayVentaEnCurso={carrito.length > 0}
          onCerrar={() => setModal(null)}
          onMenuPrincipal={() => navigate('/')}
          onInventario={() => navigate('/inventario')}
          onLogout={cerrarSesion}
          onTurnoCerrado={turnoCerrado}
          onVentaCambiada={cargarProductos}
        />
      )}
      {ticket && <Ticket venta={ticket} onCerrar={() => setTicket(null)} />}
    </div>
  )
}
