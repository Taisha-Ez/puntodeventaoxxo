import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Producto])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [TypeOrmModule, CategoriasService],
})
export class CategoriasModule {}