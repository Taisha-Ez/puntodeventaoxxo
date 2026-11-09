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
exports.Producto = void 0;
const typeorm_1 = require("typeorm");
const decimal_transformer_1 = require("../../common/transformers/decimal.transformer");
const categoria_entity_1 = require("../../categorias/entities/categoria.entity");
const proveedore_entity_1 = require("../../proveedores/entities/proveedore.entity");
const promocione_entity_1 = require("../../promociones/entities/promocione.entity");
let Producto = class Producto {
    id;
    codigoBarras;
    nombre;
    precioCompra;
    precioVenta;
    stockActual;
    stockMinimo;
    activo;
    categoria;
    proveedor;
    promociones;
};
exports.Producto = Producto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Producto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo_barras', length: 20, unique: true }),
    __metadata("design:type", String)
], Producto.prototype, "codigoBarras", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], Producto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'precio_compra', precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Producto.prototype, "precioCompra", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'precio_venta', precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Producto.prototype, "precioVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_actual', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Producto.prototype, "stockActual", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_minimo', type: 'int', default: 5 }),
    __metadata("design:type", Number)
], Producto.prototype, "stockMinimo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Producto.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'categoria_id' }),
    __metadata("design:type", categoria_entity_1.Categoria)
], Producto.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proveedore_entity_1.Proveedor, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'proveedor_id' }),
    __metadata("design:type", proveedore_entity_1.Proveedor)
], Producto.prototype, "proveedor", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => promocione_entity_1.Promocion, (promocion) => promocion.productos),
    __metadata("design:type", Array)
], Producto.prototype, "promociones", void 0);
exports.Producto = Producto = __decorate([
    (0, typeorm_1.Entity)('productos')
], Producto);
//# sourceMappingURL=producto.entity.js.map