"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProveedoreDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_proveedore_dto_1 = require("./create-proveedore.dto");
class UpdateProveedoreDto extends (0, mapped_types_1.PartialType)(create_proveedore_dto_1.CreateProveedoreDto) {
}
exports.UpdateProveedoreDto = UpdateProveedoreDto;
//# sourceMappingURL=update-proveedore.dto.js.map