import { Trim } from '../../common/decorators/trim.decorator';
import {ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Max, Matches } from 'class-validator';
import { TipoPromocion } from '../entities/promocione.entity';
 
export class CreatePromocionDto {
  @Trim()
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
  @Max(99999999.99, { message: 'El monto no puede ser mayor a 99,999,999.99' })
  valor?: number;
 
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaInicio debe tener formato AAAA-MM-DD' })
  @IsDateString({ strict: true }, { message: 'fechaInicio no es una fecha real' })
  fechaInicio: string;
 
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaFin debe tener formato AAAA-MM-DD' })
  @IsDateString({ strict: true }, { message: 'fechaFin no es una fecha real' })
  fechaFin: string;
 
  // Productos a los que aplica (relación muchos a muchos)
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  productoIds: number[];
}
