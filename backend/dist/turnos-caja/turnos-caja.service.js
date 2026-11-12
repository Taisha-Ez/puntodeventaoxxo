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
exports.TurnosCajaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const turnos_caja_entity_1 = require("./entities/turnos-caja.entity");
const caja_entity_1 = require("../cajas/entities/caja.entity");
const venta_entity_1 = require("../ventas/entities/venta.entity");
const pago_venta_entity_1 = require("../ventas/entities/pago-venta.entity");
const redondear_1 = require("../common/utils/redondear");
let TurnosCajaService = class TurnosCajaService {
    turnoRepo;
    dataSource;
    constructor(turnoRepo, dataSource) {
        this.turnoRepo = turnoRepo;
        this.dataSource = dataSource;
    }
    async abrir(dto, usuarioId) {
        const yaAbierto = await this.buscarTurnoAbierto(usuarioId);
        if (yaAbierto)
            throw new common_1.BadRequestException('Ya tienes un turno abierto; ciérralo antes de abrir otro');
        const caja = await this.dataSource.getRepository(caja_entity_1.Caja).findOneBy({ id: dto.cajaId, activa: true });
        if (!caja)
            throw new common_1.NotFoundException(`Caja ${dto.cajaId} no encontrada`);
        const cajaOcupada = await this.turnoRepo.findOne({
            where: { caja: { id: dto.cajaId }, estado: turnos_caja_entity_1.EstadoTurno.ABIERTO },
        });
        if (cajaOcupada)
            throw new common_1.ConflictException(`La caja ${caja.numero} ya tiene un turno abierto`);
        const turno = this.turnoRepo.create({
            caja,
            usuario: { id: usuarioId },
            montoInicial: dto.montoInicial,
        });
        return this.turnoRepo.save(turno);
    }
    async miTurno(usuarioId) {
        const turno = await this.buscarTurnoAbierto(usuarioId);
        if (!turno)
            throw new common_1.NotFoundException('No tienes un turno abierto');
        return { turno, resumen: await this.calcularResumen(turno) };
    }
    async cerrar(dto, usuarioId) {
        const turno = await this.buscarTurnoAbierto(usuarioId);
        if (!turno)
            throw new common_1.NotFoundException('No tienes un turno abierto');
        const resumen = await this.calcularResumen(turno);
        turno.montoFinal = dto.montoFinal;
        turno.diferencia = (0, redondear_1.redondear)(dto.montoFinal - resumen.efectivoEsperado);
        turno.fechaCierre = new Date();
        turno.estado = turnos_caja_entity_1.EstadoTurno.CERRADO;
        await this.turnoRepo.save(turno);
        return { turno, resumen };
    }
    findAll() {
        return this.turnoRepo.find({
            relations: { caja: true, usuario: true },
            order: { fechaApertura: 'DESC' },
            take: 100,
        });
    }
    async findOne(id) {
        const turno = await this.turnoRepo.findOne({ where: { id }, relations: { caja: true, usuario: true } });
        if (!turno)
            throw new common_1.NotFoundException(`Turno ${id} no encontrado`);
        return { turno, resumen: await this.calcularResumen(turno) };
    }
    buscarTurnoAbierto(usuarioId) {
        return this.turnoRepo.findOne({
            where: { usuario: { id: usuarioId }, estado: turnos_caja_entity_1.EstadoTurno.ABIERTO },
            relations: { caja: true },
        });
    }
    async calcularResumen(turno) {
        const ventas = await this.dataSource
            .getRepository(venta_entity_1.Venta)
            .createQueryBuilder('v')
            .innerJoin('v.turno', 't')
            .select('COUNT(v.id)', 'numVentas')
            .addSelect('COALESCE(SUM(v.total), 0)', 'totalVendido')
            .where('t.id = :id', { id: turno.id })
            .andWhere('v.estado = :estado', { estado: venta_entity_1.EstadoVenta.PAGADA })
            .getRawOne();
        const efectivo = await this.dataSource
            .getRepository(pago_venta_entity_1.PagoVenta)
            .createQueryBuilder('p')
            .innerJoin('p.venta', 'v')
            .innerJoin('v.turno', 't')
            .innerJoin('p.metodoPago', 'm')
            .select('COALESCE(SUM(p.monto - p.cambio), 0)', 'efectivo')
            .where('t.id = :id', { id: turno.id })
            .andWhere('v.estado = :estado', { estado: venta_entity_1.EstadoVenta.PAGADA })
            .andWhere('m.nombre = :metodo', { metodo: 'efectivo' })
            .getRawOne();
        const efectivoVentas = (0, redondear_1.redondear)(Number(efectivo?.efectivo ?? 0));
        return {
            numVentas: Number(ventas?.numVentas ?? 0),
            totalVendido: (0, redondear_1.redondear)(Number(ventas?.totalVendido ?? 0)),
            efectivoVentas,
            efectivoEsperado: (0, redondear_1.redondear)(turno.montoInicial + efectivoVentas),
        };
    }
};
exports.TurnosCajaService = TurnosCajaService;
exports.TurnosCajaService = TurnosCajaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(turnos_caja_entity_1.TurnoCaja)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], TurnosCajaService);
//# sourceMappingURL=turnos-caja.service.js.map