import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,} from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { Producto } from '../../productos/entities/producto.entity';
 
export enum TipoPromocion {
  DOS_POR_UNO = 'DOS_POR_UNO',
  PORCENTAJE = 'PORCENTAJE',
  PRECIO_ESPECIAL = 'PRECIO_ESPECIAL',
}
 
@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ length: 100 })
  nombre: string;
 
  @Column({ type: 'enum', enum: TipoPromocion })
  tipo: TipoPromocion;
 
  // % de descuento o precio especial; en 2x1 puede ir vacío
  @Column('decimal', { precision: 10, scale: 2, nullable: true, transformer: decimalTransformer })
  valor: number;
 
  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;
 
  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: string;
 
  @Column({ default: true })
  activa: boolean;
 
  // RELACIÓN MUCHOS A MUCHOS: crea la tabla intermedia promociones_productos
  @ManyToMany(() => Producto, (producto) => producto.promociones)
  @JoinTable({
    name: 'promociones_productos',
    joinColumn: { name: 'promocion_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'producto_id', referencedColumnName: 'id' },
  })
  productos: Producto[];
}
