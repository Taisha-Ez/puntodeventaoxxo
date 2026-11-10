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
exports.PromocionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promocione_entity_1 = require("./entities/promocione.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
let PromocionesService = class PromocionesService {
    promocionRepo;
    productoRepo;
    constructor(promocionRepo, productoRepo) {
        this.promocionRepo = promocionRepo;
        this.productoRepo = productoRepo;
    }
    async create(dto) {
        const { productoIds, ...datos } = dto;
        this.validarReglas(datos.tipo, datos.valor, datos.fechaInicio, datos.fechaFin);
        const promocion = this.promocionRepo.create({
            ...datos,
            productos: await this.buscarProductos(productoIds),
        });
        return this.promocionRepo.save(promocion);
    }
    findAll() {
        return this.promocionRepo.find({ relations: { productos: true }, order: { fechaInicio: 'DESC' } });
    }
    findVigentes() {
        const hoy = new Date().toLocaleDateString('en-CA');
        return this.promocionRepo.find({
            where: { activa: true, fechaInicio: (0, typeorm_2.LessThanOrEqual)(hoy), fechaFin: (0, typeorm_2.MoreThanOrEqual)(hoy) },
            relations: { productos: true },
        });
    }
    async findOne(id) {
        const promocion = await this.promocionRepo.findOne({ where: { id }, relations: { productos: true } });
        if (!promocion)
            throw new common_1.NotFoundException(`Promoción ${id} no encontrada`);
        return promocion;
    }
    async update(id, dto) {
        const promocion = await this.findOne(id);
        const { productoIds, ...datos } = dto;
        Object.assign(promocion, datos);
        this.validarReglas(promocion.tipo, promocion.valor, promocion.fechaInicio, promocion.fechaFin);
        if (productoIds)
            promocion.productos = await this.buscarProductos(productoIds);
        return this.promocionRepo.save(promocion);
    }
    async remove(id) {
        const promocion = await this.findOne(id);
        promocion.activa = false;
        await this.promocionRepo.save(promocion);
        return { mensaje: 'Promoción desactivada' };
    }
    validarReglas(tipo, valor, inicio, fin) {
        if (fin < inicio) {
            throw new common_1.BadRequestException('La fecha de fin no puede ser anterior a la de inicio');
        }
        if (tipo !== promocione_entity_1.TipoPromocion.DOS_POR_UNO && !valor) {
            throw new common_1.BadRequestException('Las promociones de porcentaje o precio especial necesitan un valor');
        }
        if (tipo === promocione_entity_1.TipoPromocion.PORCENTAJE && valor && valor > 100) {
            throw new common_1.BadRequestException('El porcentaje no puede ser mayor a 100');
        }
    }
    async buscarProductos(ids) {
        const productos = await this.productoRepo.findBy({ id: (0, typeorm_2.In)(ids), activo: true });
        if (productos.length !== new Set(ids).size) {
            throw new common_1.NotFoundException('Uno o más productos no existen o están desactivados');
        }
        return productos;
    }
};
exports.PromocionesService = PromocionesService;
exports.PromocionesService = PromocionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promocione_entity_1.Promocion)),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PromocionesService);
//# sourceMappingURL=promociones.service.js.map