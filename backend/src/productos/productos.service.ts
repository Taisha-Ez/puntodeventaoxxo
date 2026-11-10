import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Proveedor } from '../proveedores/entities/proveedore.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
 
@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Categoria) private readonly categoriaRepo: Repository<Categoria>,
    @InjectRepository(Proveedor) private readonly proveedorRepo: Repository<Proveedor>,
  ) {}
 
  async create(dto: CreateProductoDto) {
    const { categoriaId, proveedorId, ...datos } = dto;
 
    const existe = await this.productoRepo.findOneBy({ codigoBarras: datos.codigoBarras });
    if (existe) throw new ConflictException('Ya existe un producto con ese código de barras');
    this.validarPrecios(datos.precioCompra, datos.precioVenta);
 
    const producto = this.productoRepo.create({
      ...datos,
      categoria: await this.buscarCategoria(categoriaId),
      proveedor: proveedorId ? await this.buscarProveedor(proveedorId) : undefined,
    });
    return this.productoRepo.save(producto);
  }
 
  // GET /productos?buscar=coca  → busca por nombre o código
  findAll(buscar?: string) {
    const relaciones = { categoria: true, proveedor: true };
    if (!buscar) {
      return this.productoRepo.find({ where: { activo: true }, relations: relaciones, order: { nombre: 'ASC' } });
    }
    return this.productoRepo.find({
      where: [
        { activo: true, nombre: Like(`%${buscar}%`) },
        { activo: true, codigoBarras: Like(`%${buscar}%`) },
      ],
      relations: relaciones,
      order: { nombre: 'ASC' },
    });
  }
 
  // Para el escáner del punto de venta
  async findByCodigo(codigoBarras: string) {
    const producto = await this.productoRepo.findOne({
      where: { codigoBarras, activo: true },
      relations: { categoria: true },
    });
    if (!producto) throw new NotFoundException(`No existe un producto con código ${codigoBarras}`);
    return producto;
  }
 
  // Productos que ya llegaron a su stock mínimo (para resurtir)
  findStockBajo() {
    return this.productoRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.proveedor', 'proveedor')
      .where('p.activo = :activo', { activo: true })
      .andWhere('p.stockActual <= p.stockMinimo')
      .orderBy('p.stockActual', 'ASC')
      .getMany();
  }
 
  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({
      where: { id },
      relations: { categoria: true, proveedor: true },
    });
    if (!producto) throw new NotFoundException(`Producto ${id} no encontrado`);
    return producto;
  }
 
  async update(id: number, dto: UpdateProductoDto) {
    const producto = await this.findOne(id);
    const { categoriaId, proveedorId, ...datos } = dto;
 
    if (datos.codigoBarras && datos.codigoBarras !== producto.codigoBarras) {
      const existe = await this.productoRepo.findOneBy({ codigoBarras: datos.codigoBarras });
      if (existe) throw new ConflictException('Ya existe un producto con ese código de barras');
    }
    if (categoriaId) producto.categoria = await this.buscarCategoria(categoriaId);
    if (proveedorId) producto.proveedor = await this.buscarProveedor(proveedorId);
 
    Object.assign(producto, datos);
    this.validarPrecios(producto.precioCompra, producto.precioVenta);
    return this.productoRepo.save(producto);
  }
 
  async remove(id: number) {
    const producto = await this.findOne(id);
    producto.activo = false;
    await this.productoRepo.save(producto);
    return { mensaje: 'Producto desactivado' };
  }
 
  private validarPrecios(precioCompra: number, precioVenta: number) {
    if (precioVenta < precioCompra) {
      throw new BadRequestException('El precio de venta no puede ser menor al de compra');
    }
  }
 
  private async buscarCategoria(id: number) {
    const categoria = await this.categoriaRepo.findOneBy({ id, activo: true });
    if (!categoria) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return categoria;
  }
 
  private async buscarProveedor(id: number) {
    const proveedor = await this.proveedorRepo.findOneBy({ id, activo: true });
    if (!proveedor) throw new NotFoundException(`Proveedor ${id} no encontrado`);
    return proveedor;
  }
}
