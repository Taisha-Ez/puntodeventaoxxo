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
exports.DevolucionesController = void 0;
const common_1 = require("@nestjs/common");
const devoluciones_service_1 = require("./devoluciones.service");
const create_devolucione_dto_1 = require("./dto/create-devolucione.dto");
const update_devolucione_dto_1 = require("./dto/update-devolucione.dto");
let DevolucionesController = class DevolucionesController {
    devolucionesService;
    constructor(devolucionesService) {
        this.devolucionesService = devolucionesService;
    }
    create(createDevolucioneDto) {
        return this.devolucionesService.create(createDevolucioneDto);
    }
    findAll() {
        return this.devolucionesService.findAll();
    }
    findOne(id) {
        return this.devolucionesService.findOne(+id);
    }
    update(id, updateDevolucioneDto) {
        return this.devolucionesService.update(+id, updateDevolucioneDto);
    }
    remove(id) {
        return this.devolucionesService.remove(+id);
    }
};
exports.DevolucionesController = DevolucionesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_devolucione_dto_1.CreateDevolucioneDto]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_devolucione_dto_1.UpdateDevolucioneDto]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevolucionesController.prototype, "remove", null);
exports.DevolucionesController = DevolucionesController = __decorate([
    (0, common_1.Controller)('devoluciones'),
    __metadata("design:paramtypes", [devoluciones_service_1.DevolucionesService])
], DevolucionesController);
//# sourceMappingURL=devoluciones.controller.js.map