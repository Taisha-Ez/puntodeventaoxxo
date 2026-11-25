import { IsInt, IsNumber, Min, Max } from 'class-validator';
 
export class AbrirTurnoDto {
  @IsInt()
  cajaId: number;
 
  // Efectivo con el que inicia la caja (fondo para dar cambio)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99, { message: 'El monto no puede ser mayor a 99,999,999.99' })
  montoInicial: number;
}
