import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePromocionDto } from './create-promocione.dto';
 
export class UpdatePromocionDto extends PartialType(CreatePromocionDto) {
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
