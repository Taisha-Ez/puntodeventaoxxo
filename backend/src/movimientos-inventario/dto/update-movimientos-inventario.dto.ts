import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoInventarioDto } from './create-movimientos-inventario.dto';

export class UpdateMovimientosInventarioDto extends PartialType(CreateMovimientoInventarioDto) {}
