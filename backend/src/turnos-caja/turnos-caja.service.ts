import { Injectable } from '@nestjs/common';
import { CreateTurnosCajaDto } from './dto/create-turnos-caja.dto';
import { UpdateTurnosCajaDto } from './dto/update-turnos-caja.dto';

@Injectable()
export class TurnosCajaService {
  create(createTurnosCajaDto: CreateTurnosCajaDto) {
    return 'This action adds a new turnosCaja';
  }

  findAll() {
    return `This action returns all turnosCaja`;
  }

  findOne(id: number) {
    return `This action returns a #${id} turnosCaja`;
  }

  update(id: number, updateTurnosCajaDto: UpdateTurnosCajaDto) {
    return `This action updates a #${id} turnosCaja`;
  }

  remove(id: number) {
    return `This action removes a #${id} turnosCaja`;
  }
}
