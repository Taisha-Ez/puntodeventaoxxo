import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { Producto } from '../../productos/entities/producto.entity';
import { Compra } from './compra.entity';
 
@Entity('detalle_compras')
export class DetalleCompra {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'int' })
  cantidad: number;
 
  @Column('decimal', { name: 'costo_unitario', precision: 10, scale: 2, transformer: decimalTransformer })
  costoUnitario: number;
 
  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  subtotal: number;
 
  @ManyToOne(() => Compra, (compra) => compra.detalles, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;
 
  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}
