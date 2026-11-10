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
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let PromocionesController = class PromocionesController {
    promocionesService;
    constructor(promocionesService) {
        this.promocionesService = promocionesService;
    }
    create(dto) {
        return this.promocionesService.create(dto);
    }
    findAll() {
        return this.promocionesService.findAll();
    }
    findVigentes() {
        return this.promocionesService.findVigentes();
    }
    findOne(id) {
        return this.promocionesService.findOne(id);
    }
    update(id, dto) {
        return this.promocionesService.update(id, dto);
    }
    remove(id) {
        return this.promocionesService.remove(id);
    }
};
exports.PromocionesController = PromocionesController;
__decorate([
    (0, roles_decorator_1.Roles)('lider'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promocione_dto_1.CreatePromocionDto]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('vigentes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findVigentes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('lider'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_promocione_dto_1.UpdatePromocionDto]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('lider'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "remove", null);
exports.PromocionesController = PromocionesController = __decorate([
    (0, common_1.Controller)('promociones'),
    __metadata("design:paramtypes", [promociones_service_1.PromocionesService])
], PromocionesController);
//# sourceMappingURL=promociones.controller.js.map