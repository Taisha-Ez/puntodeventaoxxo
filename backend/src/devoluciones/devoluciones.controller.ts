import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucionDto } from './dto/create-devolucione.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
 
@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}
 
  // Cualquiera la registra; si es ayudante queda pendiente de autorizar
  @Post()
  create(@Body() dto: CreateDevolucionDto, @UsuarioActual() usuario: UsuarioToken) {
    return this.devolucionesService.create(dto, usuario);
  }
 
  @Roles('encargado', 'lider')
  @Get()
  findAll(@Query('pendientes', new ParseBoolPipe({ optional: true })) pendientes?: boolean) {
    return this.devolucionesService.findAll(pendientes ?? false);
  }
 
  @Roles('encargado', 'lider')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionesService.findOne(id);
  }
 
  @Roles('encargado', 'lider')
  @Patch(':id/autorizar')
  autorizar(@Param('id', ParseIntPipe) id: number, @UsuarioActual() usuario: UsuarioToken) {
    return this.devolucionesService.autorizar(id, usuario.id);
  }
 
  @Roles('encargado', 'lider')
  @Delete(':id')
  rechazar(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionesService.rechazar(id);
  }
}
