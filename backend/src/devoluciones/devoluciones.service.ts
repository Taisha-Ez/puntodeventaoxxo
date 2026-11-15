import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, IsNull, Repository } from 'typeorm';
import { Devolucion } from './entities/devolucione.entity';
import { EstadoVenta, Venta } from '../ventas/entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { MovimientoInventario, TipoMovimiento } from '../movimientos-inventario/entities/movimientos-inventario.entity';
import { CreateDevolucionDto } from './dto/create-devolucione.dto';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
 
@Injectable()
export class DevolucionesService {
  constructor(
    @InjectRepository(Devolucion) private readonly devolucionRepo: Repository<Devolucion>,
    private readonly dataSource: DataSource,
  ) {}
 
  // Si la registra un ayudante queda PENDIENTE (autorizadaPor = null).
  // Si la registra un encargado o líder, queda autorizada en ese momento.
  create(dto: CreateDevolucionDto, usuario: UsuarioToken) {
    return this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOne(Venta, {
        where: { id: dto.ventaId },
        relations: { detalles: { producto: true } },
      });
      if (!venta) throw new NotFoundException(`Venta ${dto.ventaId} no encontrada`);
      if (venta.estado !== EstadoVenta.PAGADA) throw new BadRequestException('La venta está cancelada');
 
      const renglones = venta.detalles.filter((d) => d.producto.id === dto.productoId);
      if (renglones.length === 0) throw new BadRequestException('Ese producto no está en la venta');
 
      // No se puede devolver más de lo que se vendió (contando devoluciones previas, incluso pendientes)
      const vendidos = renglones.reduce((suma, d) => suma + d.cantidad, 0);
      const yaDevueltos =
        (await manager.sum(Devolucion, 'cantidad', {
          venta: { id: dto.ventaId },
          producto: { id: dto.productoId },
        })) ?? 0;
      const disponibles = vendidos - yaDevueltos;
      if (dto.cantidad > disponibles) {
        throw new BadRequestException(`Solo se pueden devolver ${disponibles} pieza(s) de este producto`);
      }
 
      const puedeAutorizar = usuario.rol === 'encargado' || usuario.rol === 'lider';
      const devolucion = await manager.save(
        manager.create(Devolucion, {
          venta: { id: dto.ventaId },
          producto: { id: dto.productoId },
          cantidad: dto.cantidad,
          motivo: dto.motivo,
          usuario: { id: usuario.id },
          autorizadaPor: puedeAutorizar ? { id: usuario.id } : undefined,
        }),
      );
      if (puedeAutorizar) {
        await this.regresarStock(manager, devolucion.id, dto.productoId, dto.cantidad, usuario.id);
      }
      return this.buscar(manager, devolucion.id);
    });
  }
 
  autorizar(id: number, usuarioId: number) {
    return this.dataSource.transaction(async (manager) => {
      const devolucion = await this.buscar(manager, id);
      if (devolucion.autorizadaPor) throw new BadRequestException('La devolución ya fue autorizada');
 
      await this.regresarStock(manager, id, devolucion.producto.id, devolucion.cantidad, usuarioId);
      await manager.update(Devolucion, id, { autorizadaPor: { id: usuarioId } });
      return this.buscar(manager, id);
    });
  }
 
  // Rechazar = borrar la solicitud (solo si sigue pendiente)
  async rechazar(id: number) {
    const devolucion = await this.buscar(this.dataSource.manager, id);
    if (devolucion.autorizadaPor) {
      throw new BadRequestException('No se puede rechazar una devolución ya autorizada');
    }
    await this.devolucionRepo.delete(id);
    return { mensaje: `Solicitud de devolución #${id} rechazada` };
  }
 
  // GET /devoluciones?pendientes=true
  findAll(soloPendientes: boolean) {
    return this.devolucionRepo.find({
      where: soloPendientes ? { autorizadaPor: IsNull() } : {},
      relations: { venta: true, producto: true, usuario: true, autorizadaPor: true },
      order: { fecha: 'DESC' },
      take: 200,
    });
  }
 
  findOne(id: number) {
    return this.buscar(this.dataSource.manager, id);
  }
 
  private async regresarStock(
    manager: EntityManager,
    devolucionId: number,
    productoId: number,
    cantidad: number,
    usuarioId: number,
  ) {
    const producto = await manager.findOne(Producto, {
      where: { id: productoId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!producto) throw new NotFoundException(`Producto ${productoId} no encontrado`);
    producto.stockActual += cantidad;
    await manager.save(producto);
    await manager.save(
      manager.create(MovimientoInventario, {
        tipo: TipoMovimiento.ENTRADA,
        cantidad,
        motivo: `Devolución #${devolucionId}`,
        producto,
        usuario: { id: usuarioId },
      }),
    );
  }
 
  private async buscar(manager: EntityManager, id: number) {
    const devolucion = await manager.findOne(Devolucion, {
      where: { id },
      relations: { venta: true, producto: true, usuario: true, autorizadaPor: true },
    });
    if (!devolucion) throw new NotFoundException(`Devolución ${id} no encontrada`);
    return devolucion;
  }
}
