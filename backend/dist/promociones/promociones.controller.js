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
exports.PromocionesController = void 0;
const common_1 = require("@nestjs/common");
const promociones_service_1 = require("./promociones.service");
const create_promocione_dto_1 = require("./dto/create-promocione.dto");
const update_promocione_dto_1 = require("./dto/update-promocione.dto");
let PromocionesController = class PromocionesController {
    promocionesService;
    constructor(promocionesService) {
        this.promocionesService = promocionesService;
    }
    create(createPromocioneDto) {
        return this.promocionesService.create(createPromocioneDto);
    }
    findAll() {
        return this.promocionesService.findAll();
    }
    findOne(id) {
        return this.promocionesService.findOne(+id);
    }
    update(id, updatePromocioneDto) {
        return this.promocionesService.update(+id, updatePromocioneDto);
    }
    remove(id) {
        return this.promocionesService.remove(+id);
    }
};
exports.PromocionesController = PromocionesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promocione_dto_1.CreatePromocioneDto]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_promocione_dto_1.UpdatePromocioneDto]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "remove", null);
exports.PromocionesController = PromocionesController = __decorate([
    (0, common_1.Controller)('promociones'),
    __metadata("design:paramtypes", [promociones_service_1.PromocionesService])
], PromocionesController);
//# sourceMappingURL=promociones.controller.js.map