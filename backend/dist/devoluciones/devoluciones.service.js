"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevolucionesService = void 0;
const common_1 = require("@nestjs/common");
let DevolucionesService = class DevolucionesService {
    create(createDevolucioneDto) {
        return 'This action adds a new devolucione';
    }
    findAll() {
        return `This action returns all devoluciones`;
    }
    findOne(id) {
        return `This action returns a #${id} devolucione`;
    }
    update(id, updateDevolucioneDto) {
        return `This action updates a #${id} devolucione`;
    }
    remove(id) {
        return `This action removes a #${id} devolucione`;
    }
};
exports.DevolucionesService = DevolucionesService;
exports.DevolucionesService = DevolucionesService = __decorate([
    (0, common_1.Injectable)()
], DevolucionesService);
//# sourceMappingURL=devoluciones.service.js.map