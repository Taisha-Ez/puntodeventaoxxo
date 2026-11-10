import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedore.entity';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedorDto } from './dto/update-proveedore.dto';
 
@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepo: Repository<Proveedor>,
  ) {}
 
  create(dto: CreateProveedoreDto) {
    return this.proveedorRepo.save(this.proveedorRepo.create(dto));
  }
 
  findAll() {
    return this.proveedorRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
  }
 
  async findOne(id: number) {
    const proveedor = await this.proveedorRepo.findOneBy({ id });
    if (!proveedor) throw new NotFoundException(`Proveedor ${id} no encontrado`);
    return proveedor;
  }
 
  async update(id: number, dto: UpdateProveedorDto) {
    const proveedor = await this.findOne(id);
    Object.assign(proveedor, dto);
    return this.proveedorRepo.save(proveedor);
  }
 
  async remove(id: number) {
    const proveedor = await this.findOne(id);
    proveedor.activo = false;
    await this.proveedorRepo.save(proveedor);
    return { mensaje: 'Proveedor desactivado' };
  }
}
