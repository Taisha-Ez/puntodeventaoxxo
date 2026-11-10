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
exports.MovimientosInventarioController = void 0;
const common_1 = require("@nestjs/common");
const movimientos_inventario_service_1 = require("./movimientos-inventario.service");
const create_movimientos_inventario_dto_1 = require("./dto/create-movimientos-inventario.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const usuario_actual_decorator_1 = require("../auth/decorators/usuario-actual.decorator");
let MovimientosInventarioController = class MovimientosInventarioController {
    movimientosService;
    constructor(movimientosService) {
        this.movimientosService = movimientosService;
    }
    create(dto, usuario) {
        return this.movimientosService.create(dto, usuario.id);
    }
    findAll(productoId) {
        return this.movimientosService.findAll(productoId);
    }
    findOne(id) {
        return this.movimientosService.findOne(id);
    }
};
exports.MovimientosInventarioController = MovimientosInventarioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, usuario_actual_decorator_1.UsuarioActual)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movimientos_inventario_dto_1.CreateMovimientoInventarioDto, Object]),
    __metadata("design:returntype", void 0)
], MovimientosInventarioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('productoId', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MovimientosInventarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MovimientosInventarioController.prototype, "findOne", null);
exports.MovimientosInventarioController = MovimientosInventarioController = __decorate([
    (0, roles_decorator_1.Roles)('encargado', 'lider'),
    (0, common_1.Controller)('movimientos-inventario'),
    __metadata("design:paramtypes", [movimientos_inventario_service_1.MovimientosInventarioService])
], MovimientosInventarioController);
//# sourceMappingURL=movimientos-inventario.controller.js.map