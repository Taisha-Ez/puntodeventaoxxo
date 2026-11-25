import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Promocion, TipoPromocion } from './entities/promocione.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreatePromocionDto } from './dto/create-promocione.dto';
import { UpdatePromocionDto } from './dto/update-promocione.dto';
 
@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(Promocion) private readonly promocionRepo: Repository<Promocion>,
    @InjectRepository(Producto) private readonly productoRepo: Repository<Producto>,
  ) {}
 
  async create(dto: CreatePromocionDto) {
    const { productoIds, ...datos } = dto;
    const productos = await this.buscarProductos(productoIds);
    this.validarReglas(datos.tipo, datos.valor, datos.fechaInicio, datos.fechaFin, productos);
 
    const promocion = this.promocionRepo.create({
      ...datos,
      productos,
    });
    return this.promocionRepo.save(promocion);
  }
 
  findAll() {
    return this.promocionRepo.find({ relations: { productos: true }, order: { fechaInicio: 'DESC' } });
  }
 
  // Promociones activas cuya fecha incluye el día de hoy
  findVigentes() {
    const hoy = new Date().toLocaleDateString('en-CA'); // formato AAAA-MM-DD
    return this.promocionRepo.find({
      where: { activa: true, fechaInicio: LessThanOrEqual(hoy), fechaFin: MoreThanOrEqual(hoy) },
      relations: { productos: true },
    });
  }
 
  async findOne(id: number) {
    const promocion = await this.promocionRepo.findOne({ where: { id }, relations: { productos: true } });
    if (!promocion) throw new NotFoundException(`Promoción ${id} no encontrada`);
    return promocion;
  }
 
  async update(id: number, dto: UpdatePromocionDto) {
    const promocion = await this.findOne(id);
    const { productoIds, ...datos } = dto;
 
    Object.assign(promocion, datos);
    // Si mandan productoIds, se reemplaza la lista completa de productos
    if (productoIds) promocion.productos = await this.buscarProductos(productoIds);
    this.validarReglas(promocion.tipo, promocion.valor, promocion.fechaInicio, promocion.fechaFin, promocion.productos);
 
    return this.promocionRepo.save(promocion);
  }
 
  async remove(id: number) {
    const promocion = await this.findOne(id);
    promocion.activa = false;
    await this.promocionRepo.save(promocion);
    return { mensaje: 'Promoción desactivada' };
  }
 
  private validarReglas(tipo: TipoPromocion, valor: number | undefined, inicio: string, fin: string, productos: Producto[]) {
    if (fin < inicio) {
      throw new BadRequestException('La fecha de fin no puede ser anterior a la de inicio');
    }
    if (tipo !== TipoPromocion.DOS_POR_UNO && !valor) {
      throw new BadRequestException('Las promociones de porcentaje o precio especial necesitan un valor');
    }
    if (tipo === TipoPromocion.PORCENTAJE && valor && valor > 100) {
      throw new BadRequestException('El porcentaje no puede ser mayor a 100');
    }
    if (tipo === TipoPromocion.PRECIO_ESPECIAL && valor) {
      const caro = productos.find((p) => valor >= p.precioVenta);
      if (caro) {
        throw new BadRequestException(
          `El precio especial debe ser menor al precio normal de "${caro.nombre}" ($${caro.precioVenta})`,
        );
      }
    }
  }
 
  private async buscarProductos(ids: number[]) {
    const productos = await this.productoRepo.findBy({ id: In(ids), activo: true });
    if (productos.length !== new Set(ids).size) {
      throw new NotFoundException('Uno o más productos no existen o están desactivados');
    }
    return productos;
  }
}
