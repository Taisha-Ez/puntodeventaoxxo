import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionesService } from './promociones.service';
import { PromocionesController } from './promociones.controller';
import { Promocion } from './entities/promocione.entity';
import { ProductosModule } from '../productos/productos.module';
 
@Module({
  imports: [TypeOrmModule.forFeature([Promocion]), ProductosModule],
  controllers: [PromocionesController],
  providers: [PromocionesService],
  exports: [TypeOrmModule, PromocionesService],
})
export class PromocionesModule {}
