import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { Producto } from '../../productos/entities/producto.entity';
import { Promocion } from '../../promociones/entities/promocione.entity';
import { Venta } from './venta.entity';
 
@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'int' })
  cantidad: number;
 
  @Column('decimal', { name: 'precio_unitario', precision: 10, scale: 2, transformer: decimalTransformer })
  precioUnitario: number;
 
  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  subtotal: number;
 
  @ManyToOne(() => Venta, (venta) => venta.detalles, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;
 
  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
 
  // Promoción aplicada a este producto (opcional)
  @ManyToOne(() => Promocion, { nullable: true })
  @JoinColumn({ name: 'promocion_id' })
  promocion: Promocion;
}
