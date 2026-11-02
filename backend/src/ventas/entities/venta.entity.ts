import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { TurnoCaja } from '../../turnos-caja/entities/turnos-caja.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { PagoVenta } from './pago-venta.entity';
 
export enum EstadoVenta {
  PAGADA = 'PAGADA',
  CANCELADA = 'CANCELADA',
}
 
@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;
 
  @CreateDateColumn()
  fecha: Date;
 
  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  subtotal: number;
 
  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: decimalTransformer })
  descuento: number;
 
  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  total: number;
 
  @Column({ type: 'enum', enum: EstadoVenta, default: EstadoVenta.PAGADA })
  estado: EstadoVenta;
 
  @ManyToOne(() => TurnoCaja, { nullable: false })
  @JoinColumn({ name: 'turno_id' })
  turno: TurnoCaja;
 
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
 
  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta, { cascade: true })
  detalles: DetalleVenta[];
 
  @OneToMany(() => PagoVenta, (pago) => pago.venta, { cascade: true })
  pagos: PagoVenta[];
}
