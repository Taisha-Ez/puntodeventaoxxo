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
let TurnosCajaController = class TurnosCajaController {
    turnosCajaService;
    constructor(turnosCajaService) {
        this.turnosCajaService = turnosCajaService;
    }
    create(createTurnosCajaDto) {
        return this.turnosCajaService.create(createTurnosCajaDto);
    }
    findAll() {
        return this.turnosCajaService.findAll();
    }
    findOne(id) {
        return this.turnosCajaService.findOne(+id);
    }
    update(id, updateTurnosCajaDto) {
        return this.turnosCajaService.update(+id, updateTurnosCajaDto);
    }
    remove(id) {
        return this.turnosCajaService.remove(+id);
    }
};
exports.TurnosCajaController = TurnosCajaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_turnos_caja_dto_1.CreateTurnosCajaDto]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_turnos_caja_dto_1.UpdateTurnosCajaDto]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TurnosCajaController.prototype, "remove", null);
exports.TurnosCajaController = TurnosCajaController = __decorate([
    (0, common_1.Controller)('turnos-caja'),
    __metadata("design:paramtypes", [turnos_caja_service_1.TurnosCajaService])
], TurnosCajaController);
//# sourceMappingURL=turnos-caja.controller.js.map