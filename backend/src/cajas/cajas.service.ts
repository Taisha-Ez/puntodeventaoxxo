import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caja } from './entities/caja.entity';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
 
@Injectable()
export class CajasService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepo: Repository<Caja>,
  ) {}
 
  async create(dto: CreateCajaDto) {
    const existe = await this.cajaRepo.findOneBy({ numero: dto.numero });
    if (existe) throw new ConflictException(`Ya existe la caja ${dto.numero}`);
    return this.cajaRepo.save(this.cajaRepo.create(dto));
  }
 
  findAll() {
    return this.cajaRepo.find({ where: { activa: true }, order: { numero: 'ASC' } });
  }
 
  async findOne(id: number) {
    const caja = await this.cajaRepo.findOneBy({ id });
    if (!caja) throw new NotFoundException(`Caja ${id} no encontrada`);
    return caja;
  }
 
  async update(id: number, dto: UpdateCajaDto) {
    const caja = await this.findOne(id);
    if (dto.numero && dto.numero !== caja.numero) {
      const existe = await this.cajaRepo.findOneBy({ numero: dto.numero });
      if (existe) throw new ConflictException(`Ya existe la caja ${dto.numero}`);
    }
    Object.assign(caja, dto);
    return this.cajaRepo.save(caja);
  }
 
  async remove(id: number) {
    const caja = await this.findOne(id);
    caja.activa = false;
    await this.cajaRepo.save(caja);
    return { mensaje: 'Caja desactivada' };
  }
}
