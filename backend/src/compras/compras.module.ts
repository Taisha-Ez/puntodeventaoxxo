import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Compra, DetalleCompra])],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [TypeOrmModule, ComprasService],
})
export class ComprasModule {}
