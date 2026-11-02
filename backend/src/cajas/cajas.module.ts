import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CajasService } from './cajas.service';
import { CajasController } from './cajas.controller';
import { Caja } from './entities/caja.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Caja])],
  controllers: [CajasController],
  providers: [CajasService],
  exports: [TypeOrmModule, CajasService],
})
export class CajasModule {}
