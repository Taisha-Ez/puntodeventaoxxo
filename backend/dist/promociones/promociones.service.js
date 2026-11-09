"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromocionesService = void 0;
const common_1 = require("@nestjs/common");
let PromocionesService = class PromocionesService {
    create(createPromocioneDto) {
        return 'This action adds a new promocione';
    }
    findAll() {
        return `This action returns all promociones`;
    }
    findOne(id) {
        return `This action returns a #${id} promocione`;
    }
    update(id, updatePromocioneDto) {
        return `This action updates a #${id} promocione`;
    }
    remove(id) {
        return `This action removes a #${id} promocione`;
    }
};
exports.PromocionesService = PromocionesService;
exports.PromocionesService = PromocionesService = __decorate([
    (0, common_1.Injectable)()
], PromocionesService);
//# sourceMappingURL=promociones.service.js.map