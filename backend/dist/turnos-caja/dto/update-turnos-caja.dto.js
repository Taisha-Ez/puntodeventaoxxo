"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTurnosCajaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_turnos_caja_dto_1 = require("./create-turnos-caja.dto");
class UpdateTurnosCajaDto extends (0, mapped_types_1.PartialType)(create_turnos_caja_dto_1.CreateTurnosCajaDto) {
}
exports.UpdateTurnosCajaDto = UpdateTurnosCajaDto;
//# sourceMappingURL=update-turnos-caja.dto.js.map