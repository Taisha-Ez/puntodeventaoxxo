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
exports.MovimientoInventario = exports.TipoMovimiento = void 0;
const typeorm_1 = require("typeorm");
const producto_entity_1 = require("../../productos/entities/producto.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
var TipoMovimiento;
(function (TipoMovimiento) {
    TipoMovimiento["ENTRADA"] = "ENTRADA";
    TipoMovimiento["SALIDA"] = "SALIDA";
    TipoMovimiento["MERMA"] = "MERMA";
    TipoMovimiento["AJUSTE"] = "AJUSTE";
})(TipoMovimiento || (exports.TipoMovimiento = TipoMovimiento = {}));
let MovimientoInventario = class MovimientoInventario {
    id;
    tipo;
    cantidad;
    motivo;
    fecha;
    producto;
    usuario;
};
exports.MovimientoInventario = MovimientoInventario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TipoMovimiento }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'producto_id' }),
    __metadata("design:type", producto_entity_1.Producto)
], MovimientoInventario.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], MovimientoInventario.prototype, "usuario", void 0);
exports.MovimientoInventario = MovimientoInventario = __decorate([
    (0, typeorm_1.Entity)('movimientos_inventario')
], MovimientoInventario);
//# sourceMappingURL=movimientos-inventario.entity.js.map