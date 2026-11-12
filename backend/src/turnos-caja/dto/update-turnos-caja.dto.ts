import { IsNumber, Min } from 'class-validator';
 
export class CerrarTurnoDto {
  // Efectivo que el usuario contó físicamente en la caja al cerrar
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoFinal: number;
}
