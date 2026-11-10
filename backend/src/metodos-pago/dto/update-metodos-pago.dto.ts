import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateMetodoPagoDto } from './create-metodos-pago.dto';
 
export class UpdateMetodoPagoDto extends PartialType(CreateMetodoPagoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
