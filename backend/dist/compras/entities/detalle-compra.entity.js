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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleCompra = void 0;
const typeorm_1 = require("typeorm");
const decimal_transformer_1 = require("../../common/transformers/decimal.transformer");
const producto_entity_1 = require("../../productos/entities/producto.entity");
const compra_entity_1 = require("./compra.entity");
let DetalleCompra = class DetalleCompra {
    id;
    cantidad;
    costoUnitario;
    subtotal;
    compra;
    producto;
};
exports.DetalleCompra = DetalleCompra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'costo_unitario', precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "costoUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compra_entity_1.Compra, (compra) => compra.detalles, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'compra_id' }),
    __metadata("design:type", compra_entity_1.Compra)
], DetalleCompra.prototype, "compra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'producto_id' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetalleCompra.prototype, "producto", void 0);
exports.DetalleCompra = DetalleCompra = __decorate([
    (0, typeorm_1.Entity)('detalle_compras')
], DetalleCompra);
//# sourceMappingURL=detalle-compra.entity.js.map