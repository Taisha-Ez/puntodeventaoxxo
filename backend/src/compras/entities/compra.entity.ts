import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { Proveedor } from '../../proveedores/entities/proveedore.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleCompra } from './detalle-compra.entity';
 
export enum EstadoCompra {
  PENDIENTE = 'PENDIENTE',
  RECIBIDA = 'RECIBIDA',
  CANCELADA = 'CANCELADA',
}
 
@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;
 
  @CreateDateColumn()
  fecha: Date;
 
  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: decimalTransformer })
  total: number;
 
  @Column({ type: 'enum', enum: EstadoCompra, default: EstadoCompra.PENDIENTE })
  estado: EstadoCompra;
 
  @ManyToOne(() => Proveedor, { nullable: false })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;
 
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
 
  @OneToMany(() => DetalleCompra, (detalle) => detalle.compra, { cascade: true })
  detalles: DetalleCompra[];
}
