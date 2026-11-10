import { CreateProveedoreDto } from './create-proveedore.dto';
declare const UpdateProveedorDto_base: import("@nestjs/mapped-types", { with: { "resolution-mode": "import" } }).MappedType<Partial<CreateProveedoreDto>>;
export declare class UpdateProveedorDto extends UpdateProveedorDto_base {
    activo?: boolean;
}
export {};
