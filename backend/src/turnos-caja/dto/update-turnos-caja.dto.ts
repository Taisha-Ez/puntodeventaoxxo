import { IsNumber, Min, Max } from 'class-validator';
 
export class CerrarTurnoDto {
  // Efectivo que el usuario contó físicamente en la caja al cerrar
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99, { message: 'El monto no puede ser mayor a 99,999,999.99' })
  montoFinal: number;
}
