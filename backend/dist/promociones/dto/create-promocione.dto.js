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
exports.CreatePromocionDto = void 0;
const class_validator_1 = require("class-validator");
const promocione_entity_1 = require("../entities/promocione.entity");
class CreatePromocionDto {
    nombre;
    tipo;
    valor;
    fechaInicio;
    fechaFin;
    productoIds;
}
exports.CreatePromocionDto = CreatePromocionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePromocionDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(promocione_entity_1.TipoPromocion, { message: 'tipo debe ser DOS_POR_UNO, PORCENTAJE o PRECIO_ESPECIAL' }),
    __metadata("design:type", String)
], CreatePromocionDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreatePromocionDto.prototype, "valor", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'fechaInicio debe tener formato AAAA-MM-DD' }),
    __metadata("design:type", String)
], CreatePromocionDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'fechaFin debe tener formato AAAA-MM-DD' }),
    __metadata("design:type", String)
], CreatePromocionDto.prototype, "fechaFin", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CreatePromocionDto.prototype, "productoIds", void 0);
//# sourceMappingURL=create-promocione.dto.js.map