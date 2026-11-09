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
exports.TurnoCaja = exports.EstadoTurno = void 0;
const typeorm_1 = require("typeorm");
const decimal_transformer_1 = require("../../common/transformers/decimal.transformer");
const caja_entity_1 = require("../../cajas/entities/caja.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
var EstadoTurno;
(function (EstadoTurno) {
    EstadoTurno["ABIERTO"] = "ABIERTO";
    EstadoTurno["CERRADO"] = "CERRADO";
})(EstadoTurno || (exports.EstadoTurno = EstadoTurno = {}));
let TurnoCaja = class TurnoCaja {
    id;
    fechaApertura;
    fechaCierre;
    montoInicial;
    montoFinal;
    diferencia;
    estado;
    caja;
    usuario;
};
exports.TurnoCaja = TurnoCaja;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TurnoCaja.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_apertura' }),
    __metadata("design:type", Date)
], TurnoCaja.prototype, "fechaApertura", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_cierre', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], TurnoCaja.prototype, "fechaCierre", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'monto_inicial', precision: 10, scale: 2, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], TurnoCaja.prototype, "montoInicial", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'monto_final', precision: 10, scale: 2, nullable: true, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], TurnoCaja.prototype, "montoFinal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], TurnoCaja.prototype, "diferencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoTurno, default: EstadoTurno.ABIERTO }),
    __metadata("design:type", String)
], TurnoCaja.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => caja_entity_1.Caja, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'caja_id' }),
    __metadata("design:type", caja_entity_1.Caja)
], TurnoCaja.prototype, "caja", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], TurnoCaja.prototype, "usuario", void 0);
exports.TurnoCaja = TurnoCaja = __decorate([
    (0, typeorm_1.Entity)('turnos_caja')
], TurnoCaja);
//# sourceMappingURL=turnos-caja.entity.js.map