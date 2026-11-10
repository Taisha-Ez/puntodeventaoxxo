import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MovimientoInventario, TipoMovimiento } from './entities/movimientos-inventario.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateMovimientoInventarioDto } from './dto/create-movimientos-inventario.dto';
 
@Injectable()
export class MovimientosInventarioService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private readonly movimientoRepo: Repository<MovimientoInventario>,
    private readonly dataSource: DataSource,
  ) {}
 
  // Regla del sistema: en la tabla, cantidad positiva = entra, negativa = sale
  create(dto: CreateMovimientoInventarioDto, usuarioId: number) {
    // Transacción: o se guardan el movimiento y el stock, o ninguno
    return this.dataSource.transaction(async (manager) => {
      const producto = await manager.findOne(Producto, {
        where: { id: dto.productoId, activo: true },
        lock: { mode: 'pessimistic_write' }, // evita que dos cambios simultáneos se pisen
      });
      if (!producto) throw new NotFoundException(`Producto ${dto.productoId} no encontrado`);
 
      const cambio = dto.tipo === TipoMovimiento.MERMA ? -Math.abs(dto.cantidad) : dto.cantidad;
      const nuevoStock = producto.stockActual + cambio;
      if (nuevoStock < 0) {
        throw new BadRequestException(`Stock insuficiente: hay ${producto.stockActual} piezas`);
      }
 
      producto.stockActual = nuevoStock;
      await manager.save(producto);
 
      const movimiento = manager.create(MovimientoInventario, {
        tipo: dto.tipo,
        cantidad: cambio,
        motivo: dto.motivo,
        producto,
        usuario: { id: usuarioId } as Usuario,
      });
      return manager.save(movimiento);
    });
  }
 
  // GET /movimientos-inventario?productoId=3 → historial de un producto
  findAll(productoId?: number) {
    return this.movimientoRepo.find({
      where: productoId ? { producto: { id: productoId } } : {},
      relations: { producto: true, usuario: true },
      order: { fecha: 'DESC' },
      take: 200,
    });
  }
 
  async findOne(id: number) {
    const movimiento = await this.movimientoRepo.findOne({
      where: { id },
      relations: { producto: true, usuario: true },
    });
    if (!movimiento) throw new NotFoundException(`Movimiento ${id} no encontrado`);
    return movimiento;
  }
}
