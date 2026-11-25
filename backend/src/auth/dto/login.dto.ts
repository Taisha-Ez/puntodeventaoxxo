import { Trim } from '../../common/decorators/trim.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}