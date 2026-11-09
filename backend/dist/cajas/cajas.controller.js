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
exports.CajasController = void 0;
const common_1 = require("@nestjs/common");
const cajas_service_1 = require("./cajas.service");
const create_caja_dto_1 = require("./dto/create-caja.dto");
const update_caja_dto_1 = require("./dto/update-caja.dto");
let CajasController = class CajasController {
    cajasService;
    constructor(cajasService) {
        this.cajasService = cajasService;
    }
    create(createCajaDto) {
        return this.cajasService.create(createCajaDto);
    }
    findAll() {
        return this.cajasService.findAll();
    }
    findOne(id) {
        return this.cajasService.findOne(+id);
    }
    update(id, updateCajaDto) {
        return this.cajasService.update(+id, updateCajaDto);
    }
    remove(id) {
        return this.cajasService.remove(+id);
    }
};
exports.CajasController = CajasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_caja_dto_1.CreateCajaDto]),
    __metadata("design:returntype", void 0)
], CajasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CajasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CajasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_caja_dto_1.UpdateCajaDto]),
    __metadata("design:returntype", void 0)
], CajasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CajasController.prototype, "remove", null);
exports.CajasController = CajasController = __decorate([
    (0, common_1.Controller)('cajas'),
    __metadata("design:paramtypes", [cajas_service_1.CajasService])
], CajasController);
//# sourceMappingURL=cajas.controller.js.map