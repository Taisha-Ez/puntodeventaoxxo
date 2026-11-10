import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CajasService } from './cajas.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { Roles } from '../auth/decorators/roles.decorator';
 
@Controller('cajas')
export class CajasController {
  constructor(private readonly cajasService: CajasService) {}
 
  @Roles('lider')
  @Post()
  create(@Body() dto: CreateCajaDto) {
    return this.cajasService.create(dto);
  }
 
  // Todos: el ayudante elige su caja al abrir turno
  @Get()
  findAll() {
    return this.cajasService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cajasService.findOne(id);
  }
 
  @Roles('lider')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCajaDto) {
    return this.cajasService.update(id, dto);
  }
 
  @Roles('lider')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cajasService.remove(id);
  }
}
