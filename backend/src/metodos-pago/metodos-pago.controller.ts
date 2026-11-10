import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodos-pago.dto';
import { Roles } from '../auth/decorators/roles.decorator';
 
@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}
 
  @Roles('lider')
  @Post()
  create(@Body() dto: CreateMetodoPagoDto) {
    return this.metodosPagoService.create(dto);
  }
 
  // Todos: se muestran al cobrar
  @Get()
  findAll() {
    return this.metodosPagoService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagoService.findOne(id);
  }
 
  @Roles('lider')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMetodoPagoDto) {
    return this.metodosPagoService.update(id, dto);
  }
 
  @Roles('lider')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metodosPagoService.remove(id);
  }
}
