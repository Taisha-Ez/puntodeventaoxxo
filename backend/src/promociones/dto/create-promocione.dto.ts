import {ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength} from 'class-validator';
import { TipoPromocion } from '../entities/promocione.entity';
 
export class CreatePromocionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
 
  @IsEnum(TipoPromocion, { message: 'tipo debe ser DOS_POR_UNO, PORCENTAJE o PRECIO_ESPECIAL' })
  tipo: TipoPromocion;
 
  // % de descuento o precio especial. En DOS_POR_UNO no se manda.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valor?: number;
 
  @IsDateString({}, { message: 'fechaInicio debe tener formato AAAA-MM-DD' })
  fechaInicio: string;
 
  @IsDateString({}, { message: 'fechaFin debe tener formato AAAA-MM-DD' })
  fechaFin: string;
 
  // Productos a los que aplica (relación muchos a muchos)
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  productoIds: number[];
}
