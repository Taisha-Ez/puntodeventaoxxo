"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CajasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cajas_service_1 = require("./cajas.service");
const cajas_controller_1 = require("./cajas.controller");
const caja_entity_1 = require("./entities/caja.entity");
let CajasModule = class CajasModule {
};
exports.CajasModule = CajasModule;
exports.CajasModule = CajasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([caja_entity_1.Caja])],
        controllers: [cajas_controller_1.CajasController],
        providers: [cajas_service_1.CajasService],
        exports: [typeorm_1.TypeOrmModule, cajas_service_1.CajasService],
    })
], CajasModule);
//# sourceMappingURL=cajas.module.js.map