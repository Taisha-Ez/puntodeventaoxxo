import { CreateMetodoPagoDto } from './create-metodos-pago.dto';
declare const UpdateMetodoPagoDto_base: import("@nestjs/mapped-types", { with: { "resolution-mode": "import" } }).MappedType<Partial<CreateMetodoPagoDto>>;
export declare class UpdateMetodoPagoDto extends UpdateMetodoPagoDto_base {
    activo?: boolean;
}
export {};
