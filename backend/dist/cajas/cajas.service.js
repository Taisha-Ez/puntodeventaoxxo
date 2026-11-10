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
exports.CajasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const caja_entity_1 = require("./entities/caja.entity");
let CajasService = class CajasService {
    cajaRepo;
    constructor(cajaRepo) {
        this.cajaRepo = cajaRepo;
    }
    async create(dto) {
        const existe = await this.cajaRepo.findOneBy({ numero: dto.numero });
        if (existe)
            throw new common_1.ConflictException(`Ya existe la caja ${dto.numero}`);
        return this.cajaRepo.save(this.cajaRepo.create(dto));
    }
    findAll() {
        return this.cajaRepo.find({ where: { activa: true }, order: { numero: 'ASC' } });
    }
    async findOne(id) {
        const caja = await this.cajaRepo.findOneBy({ id });
        if (!caja)
            throw new common_1.NotFoundException(`Caja ${id} no encontrada`);
        return caja;
    }
    async update(id, dto) {
        const caja = await this.findOne(id);
        if (dto.numero && dto.numero !== caja.numero) {
            const existe = await this.cajaRepo.findOneBy({ numero: dto.numero });
            if (existe)
                throw new common_1.ConflictException(`Ya existe la caja ${dto.numero}`);
        }
        Object.assign(caja, dto);
        return this.cajaRepo.save(caja);
    }
    async remove(id) {
        const caja = await this.findOne(id);
        caja.activa = false;
        await this.cajaRepo.save(caja);
        return { mensaje: 'Caja desactivada' };
    }
};
exports.CajasService = CajasService;
exports.CajasService = CajasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(caja_entity_1.Caja)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CajasService);
//# sourceMappingURL=cajas.service.js.map