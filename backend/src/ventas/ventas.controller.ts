import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
 
// Sin editar ni borrar: una venta solo se cancela
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}
 
  @Post()
  create(@Body() dto: CreateVentaDto, @UsuarioActual() usuario: UsuarioToken) {
    return this.ventasService.create(dto, usuario.id);
  }
 
  // Va antes de ':id'
  @Get('mi-turno')
  miTurno(@UsuarioActual() usuario: UsuarioToken) {
    return this.ventasService.miTurno(usuario.id);
  }
 
  @Roles('encargado', 'lider')
  @Get()
  findAll(
    @Query('turnoId', new ParseIntPipe({ optional: true })) turnoId?: number,
    @Query('fecha') fecha?: string,
  ) {
    return this.ventasService.findAll(turnoId, fecha);
  }
 
  // Todos: sirve como "ticket" y para buscar la venta en una devolución
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }
 
  @Roles('encargado', 'lider')
  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number, @UsuarioActual() usuario: UsuarioToken) {
    return this.ventasService.cancelar(id, usuario.id);
  }
}
