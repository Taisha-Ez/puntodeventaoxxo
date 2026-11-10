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
exports.MetodosPagoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const metodos_pago_entity_1 = require("./entities/metodos-pago.entity");
let MetodosPagoService = class MetodosPagoService {
    metodoRepo;
    constructor(metodoRepo) {
        this.metodoRepo = metodoRepo;
    }
    async create(dto) {
        const existe = await this.metodoRepo.findOneBy({ nombre: dto.nombre });
        if (existe)
            throw new common_1.ConflictException('Ese método de pago ya existe');
        return this.metodoRepo.save(this.metodoRepo.create(dto));
    }
    findAll() {
        return this.metodoRepo.find({ where: { activo: true }, order: { id: 'ASC' } });
    }
    async findOne(id) {
        const metodo = await this.metodoRepo.findOneBy({ id });
        if (!metodo)
            throw new common_1.NotFoundException(`Método de pago ${id} no encontrado`);
        return metodo;
    }
    async update(id, dto) {
        const metodo = await this.findOne(id);
        Object.assign(metodo, dto);
        return this.metodoRepo.save(metodo);
    }
    async remove(id) {
        const metodo = await this.findOne(id);
        metodo.activo = false;
        await this.metodoRepo.save(metodo);
        return { mensaje: 'Método de pago desactivado' };
    }
};
exports.MetodosPagoService = MetodosPagoService;
exports.MetodosPagoService = MetodosPagoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(metodos_pago_entity_1.MetodoPago)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MetodosPagoService);
//# sourceMappingURL=metodos-pago.service.js.map