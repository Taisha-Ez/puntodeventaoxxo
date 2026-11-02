import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosCajaService } from './turnos-caja.service';
import { TurnosCajaController } from './turnos-caja.controller';
import { TurnoCaja } from './entities/turnos-caja.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([TurnoCaja])],
  controllers: [TurnosCajaController],
  providers: [TurnosCajaService],
  exports: [TypeOrmModule, TurnosCajaService],
})
export class TurnosCajaModule {}
