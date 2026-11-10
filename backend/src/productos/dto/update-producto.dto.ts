import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';
 
export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
