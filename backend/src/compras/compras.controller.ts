import { Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { EstadoCompra } from './entities/compra.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
 
@Roles('encargado', 'lider')
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}
 
  @Post()
  create(@Body() dto: CreateCompraDto, @UsuarioActual() usuario: UsuarioToken) {
    return this.comprasService.create(dto, usuario.id);
  }
 
  @Get()
  findAll(@Query('estado', new ParseEnumPipe(EstadoCompra, { optional: true })) estado?: EstadoCompra) {
    return this.comprasService.findAll(estado);
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.findOne(id);
  }
 
  @Patch(':id/recibir')
  recibir(@Param('id', ParseIntPipe) id: number, @UsuarioActual() usuario: UsuarioToken) {
    return this.comprasService.recibir(id, usuario.id);
  }
 
  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.cancelar(id);
  }
}
