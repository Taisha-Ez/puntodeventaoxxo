import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto) {
    const existe = await this.categoriaRepo.findOneBy({ nombre: dto.nombre });
    if (existe) throw new ConflictException('Ya existe una categoría con ese nombre');
    return this.categoriaRepo.save(this.categoriaRepo.create(dto));
  }

  findAll() {
    return this.categoriaRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepo.findOneBy({ id });
    if (!categoria) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    Object.assign(categoria, dto);
    return this.categoriaRepo.save(categoria);
  }

  // No se borra: se desactiva, porque puede haber productos que la usan
  async remove(id: number) {
    const categoria = await this.findOne(id);
    categoria.activo = false;
    await this.categoriaRepo.save(categoria);
    return { mensaje: 'Categoría desactivada' };
  }
}