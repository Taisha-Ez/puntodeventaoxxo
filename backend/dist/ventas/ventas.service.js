"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_entity_1 = require("./entities/venta.entity");
const detalle_venta_entity_1 = require("./entities/detalle-venta.entity");
const pago_venta_entity_1 = require("./entities/pago-venta.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
const promocione_entity_1 = require("../promociones/entities/promocione.entity");
const metodos_pago_entity_1 = require("../metodos-pago/entities/metodos-pago.entity");
const turnos_caja_entity_1 = require("../turnos-caja/entities/turnos-caja.entity");
const movimientos_inventario_entity_1 = require("../movimientos-inventario/entities/movimientos-inventario.entity");
const devolucione_entity_1 = require("../devoluciones/entities/devolucione.entity");
const redondear_1 = require("../common/utils/redondear");
let VentasService = class VentasService {
    ventaRepo;
    dataSource;
    constructor(ventaRepo, dataSource) {
        this.ventaRepo = ventaRepo;
        this.dataSource = dataSource;
    }
    create(dto, usuarioId) {
        return this.dataSource.transaction(async (manager) => {
            const turno = await manager.findOne(turnos_caja_entity_1.TurnoCaja, {
                where: { usuario: { id: usuarioId }, estado: turnos_caja_entity_1.EstadoTurno.ABIERTO },
            });
            if (!turno)
                throw new common_1.BadRequestException('Debes abrir un turno de caja antes de vender');
            const cantidades = new Map();
            for (const d of dto.detalles) {
                cantidades.set(d.productoId, (cantidades.get(d.productoId) ?? 0) + d.cantidad);
            }
            const ids = [...cantidades.keys()];
            const productos = await manager.find(producto_entity_1.Producto, {
                where: { id: (0, typeorm_2.In)(ids), activo: true },
                lock: { mode: 'pessimistic_write' },
            });
            if (productos.length !== ids.length) {
                throw new common_1.NotFoundException('Uno o más productos no existen o están desactivados');
            }
            const hoy = new Date().toLocaleDateString('en-CA');
            const promociones = await manager.find(promocione_entity_1.Promocion, {
                where: {
                    activa: true,
                    fechaInicio: (0, typeorm_2.LessThanOrEqual)(hoy),
                    fechaFin: (0, typeorm_2.MoreThanOrEqual)(hoy),
                    productos: { id: (0, typeorm_2.In)(ids) },
                },
                relations: { productos: true },
            });
            let subtotal = 0;
            let descuento = 0;
            const detalles = productos.map((producto) => {
                const cantidad = cantidades.get(producto.id) ?? 0;
                if (producto.stockActual < cantidad) {
                    throw new common_1.BadRequestException(`Stock insuficiente de "${producto.nombre}": hay ${producto.stockActual} piezas`);
                }
                const bruto = (0, redondear_1.redondear)(producto.precioVenta * cantidad);
                const mejor = this.mejorPromocion(producto, cantidad, promociones);
                subtotal += bruto;
                descuento += mejor.descuento;
                producto.stockActual -= cantidad;
                return manager.create(detalle_venta_entity_1.DetalleVenta, {
                    producto,
                    cantidad,
                    precioUnitario: producto.precioVenta,
                    subtotal: (0, redondear_1.redondear)(bruto - mejor.descuento),
                    promocion: mejor.promocion ?? undefined,
                });
            });
            subtotal = (0, redondear_1.redondear)(subtotal);
            descuento = (0, redondear_1.redondear)(descuento);
            const total = (0, redondear_1.redondear)(subtotal - descuento);
            const pagos = await this.armarPagos(manager, dto, total);
            const venta = await manager.save(manager.create(venta_entity_1.Venta, { turno, usuario: { id: usuarioId }, subtotal, descuento, total, detalles, pagos }));
            await manager.save(productos);
            await manager.save(productos.map((producto) => manager.create(movimientos_inventario_entity_1.MovimientoInventario, {
                tipo: movimientos_inventario_entity_1.TipoMovimiento.SALIDA,
                cantidad: -(cantidades.get(producto.id) ?? 0),
                motivo: `Venta #${venta.id}`,
                producto,
                usuario: { id: usuarioId },
            })));
            return this.buscarCompleta(manager, venta.id);
        });
    }
    async miTurno(usuarioId) {
        const turno = await this.dataSource.getRepository(turnos_caja_entity_1.TurnoCaja).findOne({
            where: { usuario: { id: usuarioId }, estado: turnos_caja_entity_1.EstadoTurno.ABIERTO },
        });
        if (!turno)
            throw new common_1.NotFoundException('No tienes un turno abierto');
        return this.ventaRepo.find({ where: { turno: { id: turno.id } }, order: { fecha: 'DESC' } });
    }
    findAll(turnoId, fecha) {
        let rangoFecha;
        if (fecha) {
            const inicio = new Date(`${fecha}T00:00:00`);
            if (isNaN(inicio.getTime()))
                throw new common_1.BadRequestException('fecha debe tener formato AAAA-MM-DD');
            rangoFecha = (0, typeorm_2.Between)(inicio, new Date(`${fecha}T23:59:59.999`));
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
    findOne(id) {
        return this.buscarCompleta(this.dataSource.manager, id);
    }
    cancelar(id, usuarioId) {
        return this.dataSource.transaction(async (manager) => {
            const venta = await manager.findOne(venta_entity_1.Venta, {
                where: { id },
                relations: { turno: true, detalles: { producto: true } },
            });
            if (!venta)
                throw new common_1.NotFoundException(`Venta ${id} no encontrada`);
            if (venta.estado === venta_entity_1.EstadoVenta.CANCELADA)
                throw new common_1.BadRequestException('La venta ya está cancelada');
            if (venta.turno.estado !== turnos_caja_entity_1.EstadoTurno.ABIERTO) {
                throw new common_1.BadRequestException('Solo se pueden cancelar ventas de un turno abierto; usa una devolución');
            }
            const devoluciones = await manager.count(devolucione_entity_1.Devolucion, { where: { venta: { id } } });
            if (devoluciones > 0) {
                throw new common_1.BadRequestException('La venta tiene devoluciones registradas; no se puede cancelar completa');
            }
            const productos = await manager.find(producto_entity_1.Producto, {
                where: { id: (0, typeorm_2.In)(venta.detalles.map((d) => d.producto.id)) },
                lock: { mode: 'pessimistic_write' },
            });
            for (const detalle of venta.detalles) {
                const producto = productos.find((p) => p.id === detalle.producto.id);
                if (producto)
                    producto.stockActual += detalle.cantidad;
            }
            await manager.save(productos);
            await manager.save(venta.detalles.map((detalle) => manager.create(movimientos_inventario_entity_1.MovimientoInventario, {
                tipo: movimientos_inventario_entity_1.TipoMovimiento.ENTRADA,
                cantidad: detalle.cantidad,
                motivo: `Cancelación de venta #${id}`,
                producto: { id: detalle.producto.id },
                usuario: { id: usuarioId },
            })));
            await manager.update(venta_entity_1.Venta, id, { estado: venta_entity_1.EstadoVenta.CANCELADA });
            return { mensaje: `Venta #${id} cancelada y stock regresado` };
        });
    }
    async armarPagos(manager, dto, total) {
        const metodoIds = [...new Set(dto.pagos.map((p) => p.metodoPagoId))];
        const metodos = await manager.find(metodos_pago_entity_1.MetodoPago, { where: { id: (0, typeorm_2.In)(metodoIds), activo: true } });
        if (metodos.length !== metodoIds.length)
            throw new common_1.NotFoundException('Método de pago no válido');
        const totalPagado = (0, redondear_1.redondear)(dto.pagos.reduce((suma, p) => suma + p.monto, 0));
        if (totalPagado < total) {
            throw new common_1.BadRequestException(`Pago insuficiente: el total es $${total} y se pagaron $${totalPagado}`);
        }
        let cambioPendiente = (0, redondear_1.redondear)(totalPagado - total);
        const pagos = dto.pagos.map((p) => {
            const metodoPago = metodos.find((m) => m.id === p.metodoPagoId);
            let cambio = 0;
            if (cambioPendiente > 0 && metodoPago?.nombre === 'efectivo') {
                cambio = Math.min(cambioPendiente, p.monto);
                cambioPendiente = (0, redondear_1.redondear)(cambioPendiente - cambio);
            }
            return manager.create(pago_venta_entity_1.PagoVenta, { metodoPago, monto: p.monto, cambio });
        });
        if (cambioPendiente > 0) {
            throw new common_1.BadRequestException('Con tarjeta o transferencia no se puede pagar de más; solo hay cambio en efectivo');
        }
        return pagos;
    }
    mejorPromocion(producto, cantidad, promociones) {
        let mejor = { promocion: null, descuento: 0 };
        const precio = producto.precioVenta;
        for (const promo of promociones) {
            if (!promo.productos.some((p) => p.id === producto.id))
                continue;
            let descuento = 0;
            if (promo.tipo === promocione_entity_1.TipoPromocion.PORCENTAJE) {
                descuento = precio * cantidad * (promo.valor / 100);
            }
            else if (promo.tipo === promocione_entity_1.TipoPromocion.PRECIO_ESPECIAL && promo.valor < precio) {
                descuento = (precio - promo.valor) * cantidad;
            }
            else if (promo.tipo === promocione_entity_1.TipoPromocion.DOS_POR_UNO) {
                descuento = Math.floor(cantidad / 2) * precio;
            }
            descuento = (0, redondear_1.redondear)(descuento);
            if (descuento > mejor.descuento)
                mejor = { promocion: promo, descuento };
        }
        return mejor;
    }
    async buscarCompleta(manager, id) {
        const venta = await manager.findOne(venta_entity_1.Venta, {
            where: { id },
            relations: {
                usuario: true,
                turno: { caja: true },
                detalles: { producto: true, promocion: true },
                pagos: { metodoPago: true },
            },
        });
        if (!venta)
            throw new common_1.NotFoundException(`Venta ${id} no encontrada`);
        return venta;
    }
};
exports.VentasService = VentasService;
exports.VentasService = VentasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], VentasService);
//# sourceMappingURL=ventas.service.js.map