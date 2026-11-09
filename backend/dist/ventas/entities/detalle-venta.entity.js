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
exports.DetalleVenta = void 0;
const typeorm_1 = require("typeorm");
const decimal_transformer_1 = require("../../common/transformers/decimal.transformer");
const producto_entity_1 = require("../../productos/entities/producto.entity");
const promocione_entity_1 = require("../../promociones/entities/promocione.entity");
const venta_entity_1 = require("./venta.entity");
let DetalleVenta = class DetalleVenta {
    id;
    cantidad;
    precioUnitario;
    subtotal;
    venta;
    producto;
    promocion;
};
exports.DetalleVenta = DetalleVenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'precio_unitario', precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, (venta) => venta.detalles, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'venta_id' }),
    __metadata("design:type", venta_entity_1.Venta)
], DetalleVenta.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'producto_id' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetalleVenta.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => promocione_entity_1.Promocion, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'promocion_id' }),
    __metadata("design:type", promocione_entity_1.Promocion)
], DetalleVenta.prototype, "promocion", void 0);
exports.DetalleVenta = DetalleVenta = __decorate([
    (0, typeorm_1.Entity)('detalle_ventas')
], DetalleVenta);
//# sourceMappingURL=detalle-venta.entity.js.map