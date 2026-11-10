import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Roles } from '../auth/decorators/roles.decorator';
 
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
 
  @Roles('encargado', 'lider')
  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }
 
  @Get()
  findAll(@Query('buscar') buscar?: string) {
    return this.productosService.findAll(buscar);
  }
 
  // IMPORTANTE: estas rutas van antes de ':id', si no Nest las confunde con un id
  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo') codigo: string) {
    return this.productosService.findByCodigo(codigo);
  }
 
  @Roles('encargado', 'lider')
  @Get('stock-bajo')
  findStockBajo() {
    return this.productosService.findStockBajo();
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }
 
  @Roles('encargado', 'lider')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    return this.productosService.update(id, dto);
  }
 
  @Roles('encargado', 'lider')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
