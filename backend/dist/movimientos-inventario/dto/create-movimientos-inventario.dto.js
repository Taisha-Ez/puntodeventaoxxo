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
exports.CreateMovimientoInventarioDto = void 0;
const class_validator_1 = require("class-validator");
const movimientos_inventario_entity_1 = require("../entities/movimientos-inventario.entity");
class CreateMovimientoInventarioDto {
    productoId;
    tipo;
    cantidad;
    motivo;
}
exports.CreateMovimientoInventarioDto = CreateMovimientoInventarioDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMovimientoInventarioDto.prototype, "productoId", void 0);
__decorate([
    (0, class_validator_1.IsIn)([movimientos_inventario_entity_1.TipoMovimiento.MERMA, movimientos_inventario_entity_1.TipoMovimiento.AJUSTE], {
        message: 'Solo se pueden registrar a mano movimientos de tipo MERMA o AJUSTE',
    }),
    __metadata("design:type", String)
], CreateMovimientoInventarioDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.NotEquals)(0, { message: 'La cantidad no puede ser 0' }),
    __metadata("design:type", Number)
], CreateMovimientoInventarioDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Indica el motivo del movimiento' }),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateMovimientoInventarioDto.prototype, "motivo", void 0);
//# sourceMappingURL=create-movimientos-inventario.dto.js.map