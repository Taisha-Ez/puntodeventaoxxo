"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalTransformer = void 0;
exports.decimalTransformer = {
    to: (value) => value,
    from: (value) => value === null || value === undefined ? value : parseFloat(value),
};
//# sourceMappingURL=decimal.transformer.js.map