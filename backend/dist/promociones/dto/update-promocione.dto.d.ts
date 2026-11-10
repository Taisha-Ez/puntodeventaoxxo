import { CreatePromocionDto } from './create-promocione.dto';
declare const UpdatePromocionDto_base: import("@nestjs/mapped-types", { with: { "resolution-mode": "import" } }).MappedType<Partial<CreatePromocionDto>>;
export declare class UpdatePromocionDto extends UpdatePromocionDto_base {
    activa?: boolean;
}
export {};
