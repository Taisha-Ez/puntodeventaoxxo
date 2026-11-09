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
exports.Devolucion = void 0;
const typeorm_1 = require("typeorm");
const venta_entity_1 = require("../../ventas/entities/venta.entity");
const producto_entity_1 = require("../../productos/entities/producto.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
let Devolucion = class Devolucion {
    id;
    cantidad;
    motivo;
    fecha;
    venta;
    producto;
    usuario;
    autorizadaPor;
};
exports.Devolucion = Devolucion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Devolucion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Devolucion.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Devolucion.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Devolucion.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'venta_id' }),
    __metadata("design:type", venta_entity_1.Venta)
], Devolucion.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'producto_id' }),
    __metadata("design:type", producto_entity_1.Producto)
], Devolucion.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Devolucion.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'autorizada_por' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Devolucion.prototype, "autorizadaPor", void 0);
exports.Devolucion = Devolucion = __decorate([
    (0, typeorm_1.Entity)('devoluciones')
], Devolucion);
//# sourceMappingURL=devolucione.entity.js.map