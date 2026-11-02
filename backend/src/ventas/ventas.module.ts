import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { PagoVenta } from './entities/pago-venta.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, PagoVenta])],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [TypeOrmModule, VentasService],
})
export class VentasModule {}
