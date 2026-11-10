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
exports.MovimientosInventarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movimientos_inventario_entity_1 = require("./entities/movimientos-inventario.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
let MovimientosInventarioService = class MovimientosInventarioService {
    movimientoRepo;
    dataSource;
    constructor(movimientoRepo, dataSource) {
        this.movimientoRepo = movimientoRepo;
        this.dataSource = dataSource;
    }
    create(dto, usuarioId) {
        return this.dataSource.transaction(async (manager) => {
            const producto = await manager.findOne(producto_entity_1.Producto, {
                where: { id: dto.productoId, activo: true },
                lock: { mode: 'pessimistic_write' },
            });
            if (!producto)
                throw new common_1.NotFoundException(`Producto ${dto.productoId} no encontrado`);
            const cambio = dto.tipo === movimientos_inventario_entity_1.TipoMovimiento.MERMA ? -Math.abs(dto.cantidad) : dto.cantidad;
            const nuevoStock = producto.stockActual + cambio;
            if (nuevoStock < 0) {
                throw new common_1.BadRequestException(`Stock insuficiente: hay ${producto.stockActual} piezas`);
            }
            producto.stockActual = nuevoStock;
            await manager.save(producto);
            const movimiento = manager.create(movimientos_inventario_entity_1.MovimientoInventario, {
                tipo: dto.tipo,
                cantidad: cambio,
                motivo: dto.motivo,
                producto,
                usuario: { id: usuarioId },
            });
            return manager.save(movimiento);
        });
    }
    findAll(productoId) {
        return this.movimientoRepo.find({
            where: productoId ? { producto: { id: productoId } } : {},
            relations: { producto: true, usuario: true },
            order: { fecha: 'DESC' },
            take: 200,
        });
    }
    async findOne(id) {
        const movimiento = await this.movimientoRepo.findOne({
            where: { id },
            relations: { producto: true, usuario: true },
        });
        if (!movimiento)
            throw new common_1.NotFoundException(`Movimiento ${id} no encontrado`);
        return movimiento;
    }
};
exports.MovimientosInventarioService = MovimientosInventarioService;
exports.MovimientosInventarioService = MovimientosInventarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movimientos_inventario_entity_1.MovimientoInventario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], MovimientosInventarioService);
//# sourceMappingURL=movimientos-inventario.service.js.map