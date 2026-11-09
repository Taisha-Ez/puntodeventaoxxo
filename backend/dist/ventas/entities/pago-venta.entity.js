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
exports.PagoVenta = void 0;
const typeorm_1 = require("typeorm");
const decimal_transformer_1 = require("../../common/transformers/decimal.transformer");
const metodos_pago_entity_1 = require("../../metodos-pago/entities/metodos-pago.entity");
const venta_entity_1 = require("./venta.entity");
let PagoVenta = class PagoVenta {
    id;
    monto;
    cambio;
    venta;
    metodoPago;
};
exports.PagoVenta = PagoVenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PagoVenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], PagoVenta.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], PagoVenta.prototype, "cambio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, (venta) => venta.pagos, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'venta_id' }),
    __metadata("design:type", venta_entity_1.Venta)
], PagoVenta.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => metodos_pago_entity_1.MetodoPago, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'metodo_pago_id' }),
    __metadata("design:type", metodos_pago_entity_1.MetodoPago)
], PagoVenta.prototype, "metodoPago", void 0);
exports.PagoVenta = PagoVenta = __decorate([
    (0, typeorm_1.Entity)('pagos_venta')
], PagoVenta);
//# sourceMappingURL=pago-venta.entity.js.map