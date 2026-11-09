"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprasService = void 0;
const common_1 = require("@nestjs/common");
let ComprasService = class ComprasService {
    create(createCompraDto) {
        return 'This action adds a new compra';
    }
    findAll() {
        return `This action returns all compras`;
    }
    findOne(id) {
        return `This action returns a #${id} compra`;
    }
    update(id, updateCompraDto) {
        return `This action updates a #${id} compra`;
    }
    remove(id) {
        return `This action removes a #${id} compra`;
    }
};
exports.ComprasService = ComprasService;
exports.ComprasService = ComprasService = __decorate([
    (0, common_1.Injectable)()
], ComprasService);
//# sourceMappingURL=compras.service.js.map