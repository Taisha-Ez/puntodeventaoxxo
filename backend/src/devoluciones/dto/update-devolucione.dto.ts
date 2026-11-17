import { PartialType } from '@nestjs/mapped-types';
import { CreateDevolucionDto } from './create-devolucione.dto';

export class UpdateDevolucioneDto extends PartialType(CreateDevolucionDto) {}