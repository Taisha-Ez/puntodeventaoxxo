import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Compra, EstadoCompra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Proveedor } from '../proveedores/entities/proveedore.entity';
import { Producto } from '../productos/entities/producto.entity';
import { MovimientoInventario, TipoMovimiento } from '../movimientos-inventario/entities/movimientos-inventario.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { redondear } from '../common/utils/redondear';
 
@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra) private readonly compraRepo: Repository<Compra>,
    private readonly dataSource: DataSource,
  ) {}
 
  // Registra el pedido al proveedor. El stock NO cambia hasta que se reciba.
  async create(dto: CreateCompraDto, usuarioId: number) {
    const proveedor = await this.dataSource.getRepository(Proveedor).findOneBy({ id: dto.proveedorId, activo: true });
    if (!proveedor) throw new NotFoundException(`Proveedor ${dto.proveedorId} no encontrado`);
 
    const ids = dto.detalles.map((d) => d.productoId);
    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException('Hay productos repetidos; junta las cantidades en un solo renglón');
    }
    const productos = await this.dataSource.getRepository(Producto).findBy({ id: In(ids), activo: true });
    if (productos.length !== ids.length) {
      throw new NotFoundException('Uno o más productos no existen o están desactivados');
    }
 
    const detalles = dto.detalles.map((d) =>
      this.compraRepo.manager.create(DetalleCompra, {
        producto: productos.find((p) => p.id === d.productoId),
        cantidad: d.cantidad,
        costoUnitario: d.costoUnitario,
        subtotal: redondear(d.cantidad * d.costoUnitario),
      }),
    );
    const total = redondear(detalles.reduce((suma, d) => suma + d.subtotal, 0));
 
    const compra = await this.compraRepo.save(
      this.compraRepo.create({ proveedor, usuario: { id: usuarioId }, total, detalles }),
    );
    return this.findOne(compra.id);
  }
 
  // Llegó la mercancía: suma al stock y actualiza el precio de compra
  recibir(id: number, usuarioId: number) {
    return this.dataSource.transaction(async (manager) => {
      const compra = await manager.findOne(Compra, { where: { id }, relations: { detalles: { producto: true } } });
      if (!compra) throw new NotFoundException(`Compra ${id} no encontrada`);
      if (compra.estado !== EstadoCompra.PENDIENTE) {
        throw new BadRequestException(`La compra ya está ${compra.estado.toLowerCase()}`);
      }
 
      const productos = await manager.find(Producto, {
        where: { id: In(compra.detalles.map((d) => d.producto.id)) },
        lock: { mode: 'pessimistic_write' },
      });
      for (const detalle of compra.detalles) {
        const producto = productos.find((p) => p.id === detalle.producto.id);
        if (!producto) continue;
        producto.stockActual += detalle.cantidad;
        producto.precioCompra = detalle.costoUnitario;
      }
      await manager.save(productos);
      await manager.save(
        compra.detalles.map((detalle) =>
          manager.create(MovimientoInventario, {
            tipo: TipoMovimiento.ENTRADA,
            cantidad: detalle.cantidad,
            motivo: `Compra #${id}`,
            producto: { id: detalle.producto.id },
            usuario: { id: usuarioId },
          }),
        ),
      );
      await manager.update(Compra, id, { estado: EstadoCompra.RECIBIDA });
      return { mensaje: `Compra #${id} recibida; stock actualizado` };
    });
  }
 
  async cancelar(id: number) {
    const compra = await this.findOne(id);
    if (compra.estado !== EstadoCompra.PENDIENTE) {
      throw new BadRequestException('Solo se pueden cancelar compras pendientes');
    }
    await this.compraRepo.update(id, { estado: EstadoCompra.CANCELADA });
    return { mensaje: `Compra #${id} cancelada` };
  }
 
  // GET /compras?estado=PENDIENTE
  findAll(estado?: EstadoCompra) {
    return this.compraRepo.find({
      where: estado ? { estado } : {},
      relations: { proveedor: true, usuario: true },
      order: { fecha: 'DESC' },
      take: 200,
    });
  }
 
  async findOne(id: number) {
    const compra = await this.compraRepo.findOne({
      where: { id },
      relations: { proveedor: true, usuario: true, detalles: { producto: true } },
    });
    if (!compra) throw new NotFoundException(`Compra ${id} no encontrada`);
    return compra;
  }
}
