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
exports.Promocion = exports.TipoPromocion = void 0;
const typeorm_1 = require("typeorm");
const decimal_transformer_1 = require("../../common/transformers/decimal.transformer");
const producto_entity_1 = require("../../productos/entities/producto.entity");
var TipoPromocion;
(function (TipoPromocion) {
    TipoPromocion["DOS_POR_UNO"] = "DOS_POR_UNO";
    TipoPromocion["PORCENTAJE"] = "PORCENTAJE";
    TipoPromocion["PRECIO_ESPECIAL"] = "PRECIO_ESPECIAL";
})(TipoPromocion || (exports.TipoPromocion = TipoPromocion = {}));
let Promocion = class Promocion {
    id;
    nombre;
    tipo;
    valor;
    fechaInicio;
    fechaFin;
    activa;
    productos;
};
exports.Promocion = Promocion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Promocion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Promocion.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TipoPromocion }),
    __metadata("design:type", String)
], Promocion.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, transformer: decimal_transformer_1.decimalTransformer }),
    __metadata("design:type", Number)
], Promocion.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_inicio', type: 'date' }),
    __metadata("design:type", String)
], Promocion.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_fin', type: 'date' }),
    __metadata("design:type", String)
], Promocion.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Promocion.prototype, "activa", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => producto_entity_1.Producto, (producto) => producto.promociones),
    (0, typeorm_1.JoinTable)({
        name: 'promociones_productos',
        joinColumn: { name: 'promocion_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'producto_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Promocion.prototype, "productos", void 0);
exports.Promocion = Promocion = __decorate([
    (0, typeorm_1.Entity)('promociones')
], Promocion);
//# sourceMappingURL=promocione.entity.js.map