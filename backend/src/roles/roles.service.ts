import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';
 
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}
 
  // Solo lectura: los roles se crean en el seed y no cambian
  findAll() {
    return this.rolRepo.find({ order: { id: 'ASC' } });
  }
}
