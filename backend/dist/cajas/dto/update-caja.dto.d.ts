import { CreateCajaDto } from './create-caja.dto';
declare const UpdateCajaDto_base: import("@nestjs/mapped-types", { with: { "resolution-mode": "import" } }).MappedType<Partial<CreateCajaDto>>;
export declare class UpdateCajaDto extends UpdateCajaDto_base {
    activa?: boolean;
}
export {};
