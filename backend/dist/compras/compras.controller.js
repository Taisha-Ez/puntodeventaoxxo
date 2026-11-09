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
exports.ComprasController = void 0;
const common_1 = require("@nestjs/common");
const compras_service_1 = require("./compras.service");
const create_compra_dto_1 = require("./dto/create-compra.dto");
const update_compra_dto_1 = require("./dto/update-compra.dto");
let ComprasController = class ComprasController {
    comprasService;
    constructor(comprasService) {
        this.comprasService = comprasService;
    }
    create(createCompraDto) {
        return this.comprasService.create(createCompraDto);
    }
    findAll() {
        return this.comprasService.findAll();
    }
    findOne(id) {
        return this.comprasService.findOne(+id);
    }
    update(id, updateCompraDto) {
        return this.comprasService.update(+id, updateCompraDto);
    }
    remove(id) {
        return this.comprasService.remove(+id);
    }
};
exports.ComprasController = ComprasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_compra_dto_1.CreateCompraDto]),
    __metadata("design:returntype", void 0)
], ComprasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComprasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComprasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_compra_dto_1.UpdateCompraDto]),
    __metadata("design:returntype", void 0)
], ComprasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComprasController.prototype, "remove", null);
exports.ComprasController = ComprasController = __decorate([
    (0, common_1.Controller)('compras'),
    __metadata("design:paramtypes", [compras_service_1.ComprasService])
], ComprasController);
//# sourceMappingURL=compras.controller.js.map