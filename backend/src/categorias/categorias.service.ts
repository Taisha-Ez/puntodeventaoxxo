import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateCategoriaDto) {
    const existe = await this.categoriaRepo.findOneBy({ nombre: dto.nombre });
    // Si existe pero estaba desactivada, se reactiva (conserva su id y sus productos)
    if (existe && !existe.activo) {
      existe.activo = true;
      return this.categoriaRepo.save(existe);
    }
    if (existe) throw new ConflictException('Ya existe una categoría con ese nombre');
    return this.categoriaRepo.save(this.categoriaRepo.create(dto));
  }

  findAll() {
    return this.categoriaRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
  }

  findDesactivadas() {
    return this.categoriaRepo.find({ where: { activo: false }, order: { nombre: 'ASC' } });
  }

  async reactivar(id: number) {
    const categoria = await this.findOne(id);
    categoria.activo = true;
    return this.categoriaRepo.save(categoria);
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

  // No se borra: se desactiva. Y solo si ningún producto activo la usa
  async remove(id: number) {
    const categoria = await this.findOne(id);
    const productos = await this.productoRepo.count({
      where: { categoria: { id }, activo: true },
    });
    if (productos > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría "${categoria.nombre}" porque tiene ${productos} producto(s). Cámbialos de categoría o desactívalos primero.`,
      );
    }
    categoria.activo = false;
    await this.categoriaRepo.save(categoria);
    return { mensaje: 'Categoría desactivada' };
  }
}