import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimientos-inventario.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
 
// Sin PATCH ni DELETE: el historial de inventario no se edita ni se borra.
// Si hubo un error, se corrige con un nuevo AJUSTE.
@Roles('encargado', 'lider')
@Controller('movimientos-inventario')
export class MovimientosInventarioController {
  constructor(private readonly movimientosService: MovimientosInventarioService) {}
 
  @Post()
  create(@Body() dto: CreateMovimientoInventarioDto, @UsuarioActual() usuario: UsuarioToken) {
    return this.movimientosService.create(dto, usuario.id);
  }
 
  @Get()
  findAll(@Query('productoId', new ParseIntPipe({ optional: true })) productoId?: number) {
    return this.movimientosService.findAll(productoId);
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientosService.findOne(id);
  }
}
