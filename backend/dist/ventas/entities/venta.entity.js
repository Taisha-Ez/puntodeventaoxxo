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
exports.Venta = exports.EstadoVenta = void 0;
const typeorm_1 = require("typeorm");
const decimal_transformer_1 = require("../../common/transformers/decimal.transformer");
const turnos_caja_entity_1 = require("../../turnos-caja/entities/turnos-caja.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
const detalle_venta_entity_1 = require("./detalle-venta.entity");
const pago_venta_entity_1 = require("./pago-venta.entity");
var EstadoVenta;
(function (EstadoVenta) {
    EstadoVenta["PAGADA"] = "PAGADA";
    EstadoVenta["CANCELADA"] = "CANCELADA";
})(EstadoVenta || (exports.EstadoVenta = EstadoVenta = {}));
let Venta = class Venta {
    id;
    fecha;
    subtotal;
    descuento;
    total;
    estado;
    turno;
    usuario;
    detalles;
    pagos;
};
exports.Venta = Venta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Venta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Venta.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Venta.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Venta.prototype, "descuento", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Venta.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoVenta, default: EstadoVenta.PAGADA }),
    __metadata("design:type", String)
], Venta.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => turnos_caja_entity_1.TurnoCaja, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'turno_id' }),
    __metadata("design:type", turnos_caja_entity_1.TurnoCaja)
], Venta.prototype, "turno", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Venta.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_venta_entity_1.DetalleVenta, (detalle) => detalle.venta, { cascade: true }),
    __metadata("design:type", Array)
], Venta.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pago_venta_entity_1.PagoVenta, (pago) => pago.venta, { cascade: true }),
    __metadata("design:type", Array)
], Venta.prototype, "pagos", void 0);
exports.Venta = Venta = __decorate([
    (0, typeorm_1.Entity)('ventas')
], Venta);
//# sourceMappingURL=venta.entity.js.map