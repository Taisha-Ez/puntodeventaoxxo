import { Trim } from '../../common/decorators/trim.decorator';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
 
export class CreateMetodoPagoDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nombre: string;
}
