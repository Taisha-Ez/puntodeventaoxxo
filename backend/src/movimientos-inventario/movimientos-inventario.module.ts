import { Module } from '@nestjs/common';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { MovimientosInventarioController } from './movimientos-inventario.controller';

@Module({
  controllers: [MovimientosInventarioController],
  providers: [MovimientosInventarioService],
})
export class MovimientosInventarioModule {}
