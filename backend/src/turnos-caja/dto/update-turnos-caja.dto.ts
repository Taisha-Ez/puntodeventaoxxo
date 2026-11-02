import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnosCajaDto } from './create-turnos-caja.dto';

export class UpdateTurnosCajaDto extends PartialType(CreateTurnosCajaDto) {}
