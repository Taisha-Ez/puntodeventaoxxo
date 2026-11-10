import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/metodos-pago.entity';
import { CreateMetodoPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodos-pago.dto';
 
@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoRepo: Repository<MetodoPago>,
  ) {}
 
  async create(dto: CreateMetodoPagoDto) {
    const existe = await this.metodoRepo.findOneBy({ nombre: dto.nombre });
    if (existe) throw new ConflictException('Ese método de pago ya existe');
    return this.metodoRepo.save(this.metodoRepo.create(dto));
  }
 
  findAll() {
    return this.metodoRepo.find({ where: { activo: true }, order: { id: 'ASC' } });
  }
 
  async findOne(id: number) {
    const metodo = await this.metodoRepo.findOneBy({ id });
    if (!metodo) throw new NotFoundException(`Método de pago ${id} no encontrado`);
    return metodo;
  }
 
  async update(id: number, dto: UpdateMetodoPagoDto) {
    const metodo = await this.findOne(id);
    Object.assign(metodo, dto);
    return this.metodoRepo.save(metodo);
  }
 
  async remove(id: number) {
    const metodo = await this.findOne(id);
    metodo.activo = false;
    await this.metodoRepo.save(metodo);
    return { mensaje: 'Método de pago desactivado' };
  }
}
