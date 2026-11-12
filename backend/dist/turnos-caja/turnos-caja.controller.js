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
exports.TurnosCajaController = void 0;
const common_1 = require("@nestjs/common");
const turnos_caja_service_1 = require("./turnos-caja.service");
const create_turnos_caja_dto_1 = require("./dto/create-turnos-caja.dto");
const update_turnos_caja_dto_1 = require("./dto/update-turnos-caja.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const usuario_actual_decorator_1 = require("../auth/decorators/usuario-actual.decorator");
let TurnosCajaController = class TurnosCajaController {
    turnosService;
    constructor(turnosService) {
        this.turnosService = turnosService;
    }
    abrir(dto, usuario) {
        return this.turnosService.abrir(dto, usuario.id);
    }
    miTurno(usuario) {
        return this.turnosService.miTurno(usuario.id);
    }
    cerrar(dto, usuario) {
        return this.turnosService.cerrar(dto, usuario.id);
    }
    findAll() {
        return this.turnosService.findAll();
    }
    findOne(id) {
        return this.turnosService.findOne(id);
    }
};
exports.TurnosCajaController = TurnosCajaController;
__decorate([
    (0, common_1.Post)('abrir'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_turnos_caja_dto_1.AbrirTurnoDto, Object]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "abrir", null);
__decorate([
    (0, common_1.Get)('mi-turno'),
    __param(0, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "miTurno", null);
__decorate([
    (0, common_1.Post)('cerrar'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_turnos_caja_dto_1.CerrarTurnoDto, Object]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "cerrar", null);
__decorate([
    (0, roles_decorator_1.Roles)('encargado', 'lider'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('encargado', 'lider'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "findOne", null);
exports.TurnosCajaController = TurnosCajaController = __decorate([
    (0, common_1.Controller)('turnos-caja'),
    __metadata("design:paramtypes", [turnos_caja_service_1.TurnosCajaService])
], TurnosCajaController);
//# sourceMappingURL=turnos-caja.controller.js.map