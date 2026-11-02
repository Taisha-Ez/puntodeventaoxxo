import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedore.entity';
import { Promocion } from '../../promociones/entities/promocione.entity';
 
@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ name: 'codigo_barras', length: 20, unique: true })
  codigoBarras: string;
 
  @Column({ length: 120 })
  nombre: string;
 
  @Column('decimal', { name: 'precio_compra', precision: 10, scale: 2, transformer: decimalTransformer })
  precioCompra: number;
 
  @Column('decimal', { name: 'precio_venta', precision: 10, scale: 2, transformer: decimalTransformer })
  precioVenta: number;
 
  @Column({ name: 'stock_actual', type: 'int', default: 0 })
  stockActual: number;
 
  @Column({ name: 'stock_minimo', type: 'int', default: 5 })
  stockMinimo: number;
 
  @Column({ default: true })
  activo: boolean;
 
  @ManyToOne(() => Categoria, { nullable: false })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
 
  @ManyToOne(() => Proveedor, { nullable: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;
 
  // Lado inverso de la relación muchos a muchos
  @ManyToMany(() => Promocion, (promocion) => promocion.productos)
  promociones: Promocion[];
}
