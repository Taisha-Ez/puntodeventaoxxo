import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TurnosCajaService } from './turnos-caja.service';
import { AbrirTurnoDto } from './dto/create-turnos-caja.dto';
import { CerrarTurnoDto } from './dto/update-turnos-caja.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
 
@Controller('turnos-caja')
export class TurnosCajaController {
  constructor(private readonly turnosService: TurnosCajaService) {}
 
  // Cualquier usuario abre, consulta y cierra SU propio turno
  @Post('abrir')
  abrir(@Body() dto: AbrirTurnoDto, @UsuarioActual() usuario: UsuarioToken) {
    return this.turnosService.abrir(dto, usuario.id);
  }
 
  @Get('mi-turno')
  miTurno(@UsuarioActual() usuario: UsuarioToken) {
    return this.turnosService.miTurno(usuario.id);
  }
 
  @Post('cerrar')
  cerrar(@Body() dto: CerrarTurnoDto, @UsuarioActual() usuario: UsuarioToken) {
    return this.turnosService.cerrar(dto, usuario.id);
  }
 
  // Historial de cortes: solo encargado y líder
  @Roles('encargado', 'lider')
  @Get()
  findAll() {
    return this.turnosService.findAll();
  }
 
  @Roles('encargado', 'lider')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findOne(id);
  }
}
