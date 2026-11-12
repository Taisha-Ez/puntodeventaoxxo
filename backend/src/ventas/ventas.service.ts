import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, EntityManager, FindOperator, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EstadoVenta, Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { PagoVenta } from './entities/pago-venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Promocion, TipoPromocion } from '../promociones/entities/promocione.entity';
import { MetodoPago } from '../metodos-pago/entities/metodos-pago.entity';
import { EstadoTurno, TurnoCaja } from '../turnos-caja/entities/turnos-caja.entity';
import { MovimientoInventario, TipoMovimiento } from '../movimientos-inventario/entities/movimientos-inventario.entity';
import { Devolucion } from '../devoluciones/entities/devolucione.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { redondear } from '../common/utils/redondear';
 
@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private readonly ventaRepo: Repository<Venta>,
    private readonly dataSource: DataSource,
  ) {}
 
  // Todo dentro de una transacción: si algo falla, no se guarda NADA
  create(dto: CreateVentaDto, usuarioId: number) {
    return this.dataSource.transaction(async (manager) => {
      // 1. Debe tener un turno abierto
      const turno = await manager.findOne(TurnoCaja, {
        where: { usuario: { id: usuarioId }, estado: EstadoTurno.ABIERTO },
      });
      if (!turno) throw new BadRequestException('Debes abrir un turno de caja antes de vender');
 
      // 2. Junta renglones repetidos del mismo producto (ej. escanear 2 veces la misma coca)
      const cantidades = new Map<number, number>();
      for (const d of dto.detalles) {
        cantidades.set(d.productoId, (cantidades.get(d.productoId) ?? 0) + d.cantidad);
      }
      const ids = [...cantidades.keys()];
 
      // 3. Carga los productos bloqueándolos para que otra venta no los toque al mismo tiempo
      const productos = await manager.find(Producto, {
        where: { id: In(ids), activo: true },
        lock: { mode: 'pessimistic_write' },
      });
      if (productos.length !== ids.length) {
        throw new NotFoundException('Uno o más productos no existen o están desactivados');
      }
 
      // 4. Promociones vigentes hoy para esos productos
      const hoy = new Date().toLocaleDateString('en-CA');
      const promociones = await manager.find(Promocion, {
        where: {
          activa: true,
          fechaInicio: LessThanOrEqual(hoy),
          fechaFin: MoreThanOrEqual(hoy),
          productos: { id: In(ids) },
        },
        relations: { productos: true },
      });
 
      // 5. Arma los detalles, valida stock y calcula descuentos
      let subtotal = 0;
      let descuento = 0;
      const detalles = productos.map((producto) => {
        const cantidad = cantidades.get(producto.id) ?? 0;
        if (producto.stockActual < cantidad) {
          throw new BadRequestException(
            `Stock insuficiente de "${producto.nombre}": hay ${producto.stockActual} piezas`,
          );
        }
        const bruto = redondear(producto.precioVenta * cantidad);
        const mejor = this.mejorPromocion(producto, cantidad, promociones);
        subtotal += bruto;
        descuento += mejor.descuento;
        producto.stockActual -= cantidad;
 
        return manager.create(DetalleVenta, {
          producto,
          cantidad,
          precioUnitario: producto.precioVenta,
          subtotal: redondear(bruto - mejor.descuento),
          promocion: mejor.promocion ?? undefined,
        });
      });
      subtotal = redondear(subtotal);
      descuento = redondear(descuento);
      const total = redondear(subtotal - descuento);
 
      // 6. Pagos: deben cubrir el total; el cambio solo se da en efectivo
      const pagos = await this.armarPagos(manager, dto, total);
 
      // 7. Guarda la venta (los detalles y pagos se guardan solos por el cascade)
      const venta = await manager.save(
        manager.create(Venta, { turno, usuario: { id: usuarioId }, subtotal, descuento, total, detalles, pagos }),
      );
 
      // 8. Descuenta stock y deja registro en el historial de inventario
      await manager.save(productos);
      await manager.save(
        productos.map((producto) =>
          manager.create(MovimientoInventario, {
            tipo: TipoMovimiento.SALIDA,
            cantidad: -(cantidades.get(producto.id) ?? 0),
            motivo: `Venta #${venta.id}`,
            producto,
            usuario: { id: usuarioId },
          }),
        ),
      );
 
      return this.buscarCompleta(manager, venta.id);
    });
  }
 
  // Ventas del turno abierto del usuario
  async miTurno(usuarioId: number) {
    const turno = await this.dataSource.getRepository(TurnoCaja).findOne({
      where: { usuario: { id: usuarioId }, estado: EstadoTurno.ABIERTO },
    });
    if (!turno) throw new NotFoundException('No tienes un turno abierto');
    return this.ventaRepo.find({ where: { turno: { id: turno.id } }, order: { fecha: 'DESC' } });
  }
 
  // GET /ventas?turnoId=1  o  /ventas?fecha=2026-11-15
  findAll(turnoId?: number, fecha?: string) {
    let rangoFecha: FindOperator<Date> | undefined;
    if (fecha) {
      const inicio = new Date(`${fecha}T00:00:00`);
      if (isNaN(inicio.getTime())) throw new BadRequestException('fecha debe tener formato AAAA-MM-DD');
      rangoFecha = Between(inicio, new Date(`${fecha}T23:59:59.999`));
    }
    return this.ventaRepo.find({
      where: {
        ...(turnoId ? { turno: { id: turnoId } } : {}),
        ...(rangoFecha ? { fecha: rangoFecha } : {}),
      },
      relations: { usuario: true },
      order: { fecha: 'DESC' },
      take: 200,
    });
  }
 
  findOne(id: number) {
    return this.buscarCompleta(this.dataSource.manager, id);
  }
 
  // Cancela toda la venta y regresa el stock
  cancelar(id: number, usuarioId: number) {
    return this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOne(Venta, {
        where: { id },
        relations: { turno: true, detalles: { producto: true } },
      });
      if (!venta) throw new NotFoundException(`Venta ${id} no encontrada`);
      if (venta.estado === EstadoVenta.CANCELADA) throw new BadRequestException('La venta ya está cancelada');
      if (venta.turno.estado !== EstadoTurno.ABIERTO) {
        throw new BadRequestException('Solo se pueden cancelar ventas de un turno abierto; usa una devolución');
      }
      const devoluciones = await manager.count(Devolucion, { where: { venta: { id } } });
      if (devoluciones > 0) {
        throw new BadRequestException('La venta tiene devoluciones registradas; no se puede cancelar completa');
      }
 
      const productos = await manager.find(Producto, {
        where: { id: In(venta.detalles.map((d) => d.producto.id)) },
        lock: { mode: 'pessimistic_write' },
      });
      for (const detalle of venta.detalles) {
        const producto = productos.find((p) => p.id === detalle.producto.id);
        if (producto) producto.stockActual += detalle.cantidad;
      }
      await manager.save(productos);
      await manager.save(
        venta.detalles.map((detalle) =>
          manager.create(MovimientoInventario, {
            tipo: TipoMovimiento.ENTRADA,
            cantidad: detalle.cantidad,
            motivo: `Cancelación de venta #${id}`,
            producto: { id: detalle.producto.id },
            usuario: { id: usuarioId },
          }),
        ),
      );
      await manager.update(Venta, id, { estado: EstadoVenta.CANCELADA });
      return { mensaje: `Venta #${id} cancelada y stock regresado` };
    });
  }
 
  private async armarPagos(manager: EntityManager, dto: CreateVentaDto, total: number) {
    const metodoIds = [...new Set(dto.pagos.map((p) => p.metodoPagoId))];
    const metodos = await manager.find(MetodoPago, { where: { id: In(metodoIds), activo: true } });
    if (metodos.length !== metodoIds.length) throw new NotFoundException('Método de pago no válido');
 
    const totalPagado = redondear(dto.pagos.reduce((suma, p) => suma + p.monto, 0));
    if (totalPagado < total) {
      throw new BadRequestException(`Pago insuficiente: el total es $${total} y se pagaron $${totalPagado}`);
    }
 
    let cambioPendiente = redondear(totalPagado - total);
    const pagos = dto.pagos.map((p) => {
      const metodoPago = metodos.find((m) => m.id === p.metodoPagoId);
      let cambio = 0;
      if (cambioPendiente > 0 && metodoPago?.nombre === 'efectivo') {
        cambio = Math.min(cambioPendiente, p.monto);
        cambioPendiente = redondear(cambioPendiente - cambio);
      }
      return manager.create(PagoVenta, { metodoPago, monto: p.monto, cambio });
    });
    if (cambioPendiente > 0) {
      throw new BadRequestException('Con tarjeta o transferencia no se puede pagar de más; solo hay cambio en efectivo');
    }
    return pagos;
  }
 
  // Escoge la promoción que le da más descuento al cliente
  private mejorPromocion(producto: Producto, cantidad: number, promociones: Promocion[]) {
    let mejor: { promocion: Promocion | null; descuento: number } = { promocion: null, descuento: 0 };
    const precio = producto.precioVenta;
 
    for (const promo of promociones) {
      if (!promo.productos.some((p) => p.id === producto.id)) continue;
 
      let descuento = 0;
      if (promo.tipo === TipoPromocion.PORCENTAJE) {
        descuento = precio * cantidad * (promo.valor / 100);
      } else if (promo.tipo === TipoPromocion.PRECIO_ESPECIAL && promo.valor < precio) {
        descuento = (precio - promo.valor) * cantidad;
      } else if (promo.tipo === TipoPromocion.DOS_POR_UNO) {
        descuento = Math.floor(cantidad / 2) * precio; // cada 2 piezas, 1 es gratis
      }
      descuento = redondear(descuento);
      if (descuento > mejor.descuento) mejor = { promocion: promo, descuento };
    }
    return mejor;
  }
 
  private async buscarCompleta(manager: EntityManager, id: number) {
    const venta = await manager.findOne(Venta, {
      where: { id },
      relations: {
        usuario: true,
        turno: { caja: true },
        detalles: { producto: true, promocion: true },
        pagos: { metodoPago: true },
      },
    });
    if (!venta) throw new NotFoundException(`Venta ${id} no encontrada`);
    return venta;
  }
}
