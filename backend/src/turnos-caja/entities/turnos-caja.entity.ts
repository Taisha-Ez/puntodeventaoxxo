import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { Caja } from '../../cajas/entities/caja.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
 
export enum EstadoTurno {
  ABIERTO = 'ABIERTO',
  CERRADO = 'CERRADO',
}
 
@Entity('turnos_caja')
export class TurnoCaja {
  @PrimaryGeneratedColumn()
  id: number;
 
  @CreateDateColumn({ name: 'fecha_apertura' })
  fechaApertura: Date;
 
  @Column({ name: 'fecha_cierre', type: 'datetime', nullable: true })
  fechaCierre: Date;
 
  @Column('decimal', { name: 'monto_inicial', precision: 10, scale: 2, transformer: decimalTransformer })
  montoInicial: number;
 
  @Column('decimal', { name: 'monto_final', precision: 10, scale: 2, nullable: true, transformer: decimalTransformer })
  montoFinal: number;
 
  // monto contado - monto esperado (negativo = faltante)
  @Column('decimal', { precision: 10, scale: 2, nullable: true, transformer: decimalTransformer })
  diferencia: number;
 
  @Column({ type: 'enum', enum: EstadoTurno, default: EstadoTurno.ABIERTO })
  estado: EstadoTurno;
 
  @ManyToOne(() => Caja, { nullable: false })
  @JoinColumn({ name: 'caja_id' })
  caja: Caja;
 
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
