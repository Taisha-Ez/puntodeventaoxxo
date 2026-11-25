import { Trim } from '../../common/decorators/trim.decorator';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nombre: string;
}