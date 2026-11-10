import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateProveedoreDto } from './create-proveedore.dto';
 
export class UpdateProveedorDto extends PartialType(CreateProveedoreDto) {
  // Permite reactivar un proveedor desactivado
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
