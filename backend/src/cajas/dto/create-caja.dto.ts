import { IsInt, Min } from 'class-validator';
 
export class CreateCajaDto {
  @IsInt()
  @Min(1)
  numero: number;
}
