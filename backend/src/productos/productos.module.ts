import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { CategoriasModule } from '../categorias/categorias.module';
import { ProveedoresModule } from '../proveedores/proveedores.module';
 
@Module({
  imports: [TypeOrmModule.forFeature([Producto]), CategoriasModule, ProveedoresModule],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [TypeOrmModule, ProductosService],
})
export class ProductosModule {}
