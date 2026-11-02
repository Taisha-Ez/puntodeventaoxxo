import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { MetodoPago } from '../../metodos-pago/entities/metodos-pago.entity';
import { Venta } from './venta.entity';
 
@Entity('pagos_venta')
export class PagoVenta {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  monto: number;
 
  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: decimalTransformer })
  cambio: number;
 
  @ManyToOne(() => Venta, (venta) => venta.pagos, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;
 
  @ManyToOne(() => MetodoPago, { nullable: false })
  @JoinColumn({ name: 'metodo_pago_id' })
  metodoPago: MetodoPago;
}
