import { IsInt, IsNumber, Min } from 'class-validator';
 
export class AbrirTurnoDto {
  @IsInt()
  cajaId: number;
 
  // Efectivo con el que inicia la caja (fondo para dar cambio)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoInicial: number;
}
