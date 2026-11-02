import { Module } from '@nestjs/common';
import { TurnosCajaService } from './turnos-caja.service';
import { TurnosCajaController } from './turnos-caja.controller';

@Module({
  controllers: [TurnosCajaController],
  providers: [TurnosCajaService],
})
export class TurnosCajaModule {}
