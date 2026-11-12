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
exports.VentasController = void 0;
const common_1 = require("@nestjs/common");
const ventas_service_1 = require("./ventas.service");
const create_venta_dto_1 = require("./dto/create-venta.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const usuario_actual_decorator_1 = require("../auth/decorators/usuario-actual.decorator");
let VentasController = class VentasController {
    ventasService;
    constructor(ventasService) {
        this.ventasService = ventasService;
    }
    create(dto, usuario) {
        return this.ventasService.create(dto, usuario.id);
    }
    miTurno(usuario) {
        return this.ventasService.miTurno(usuario.id);
    }
    findAll(turnoId, fecha) {
        return this.ventasService.findAll(turnoId, fecha);
    }
    findOne(id) {
        return this.ventasService.findOne(id);
    }
    cancelar(id, usuario) {
        return this.ventasService.cancelar(id, usuario.id);
    }
};
exports.VentasController = VentasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venta_dto_1.CreateVentaDto, Object]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mi-turno'),
    __param(0, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "miTurno", null);
__decorate([
    (0, roles_decorator_1.Roles)('encargado', 'lider'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('turnoId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('encargado', 'lider'),
    (0, common_1.Patch)(':id/cancelar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "cancelar", null);
exports.VentasController = VentasController = __decorate([
    (0, common_1.Controller)('ventas'),
    __metadata("design:paramtypes", [ventas_service_1.VentasService])
], VentasController);
//# sourceMappingURL=ventas.controller.js.map