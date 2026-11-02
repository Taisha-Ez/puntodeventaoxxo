import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurnosCajaService } from './turnos-caja.service';
import { CreateTurnosCajaDto } from './dto/create-turnos-caja.dto';
import { UpdateTurnosCajaDto } from './dto/update-turnos-caja.dto';

@Controller('turnos-caja')
export class TurnosCajaController {
  constructor(private readonly turnosCajaService: TurnosCajaService) {}

  @Post()
  create(@Body() createTurnosCajaDto: CreateTurnosCajaDto) {
    return this.turnosCajaService.create(createTurnosCajaDto);
  }

  @Get()
  findAll() {
    return this.turnosCajaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosCajaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnosCajaDto: UpdateTurnosCajaDto) {
    return this.turnosCajaService.update(+id, updateTurnosCajaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosCajaService.remove(+id);
  }
}
