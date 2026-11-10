import { TipoPromocion } from '../entities/promocione.entity';
export declare class CreatePromocionDto {
    nombre: string;
    tipo: TipoPromocion;
    valor?: number;
    fechaInicio: string;
    fechaFin: string;
    productoIds: number[];
}
