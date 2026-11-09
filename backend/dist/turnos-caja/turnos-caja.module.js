"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnosCajaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const turnos_caja_service_1 = require("./turnos-caja.service");
const turnos_caja_controller_1 = require("./turnos-caja.controller");
const turnos_caja_entity_1 = require("./entities/turnos-caja.entity");
let TurnosCajaModule = class TurnosCajaModule {
};
exports.TurnosCajaModule = TurnosCajaModule;
exports.TurnosCajaModule = TurnosCajaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([turnos_caja_entity_1.TurnoCaja])],
        controllers: [turnos_caja_controller_1.TurnosCajaController],
        providers: [turnos_caja_service_1.TurnosCajaService],
        exports: [typeorm_1.TypeOrmModule, turnos_caja_service_1.TurnosCajaService],
    })
], TurnosCajaModule);
//# sourceMappingURL=turnos-caja.module.js.map