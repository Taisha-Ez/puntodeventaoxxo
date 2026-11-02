import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
 
export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  MERMA = 'MERMA',
  AJUSTE = 'AJUSTE',
}
 
@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'enum', enum: TipoMovimiento })
  tipo: TipoMovimiento;
 
  @Column({ type: 'int' })
  cantidad: number;
 
  @Column({ length: 200, nullable: true })
  motivo: string;
 
  @CreateDateColumn()
  fecha: Date;
 
  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
 
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
