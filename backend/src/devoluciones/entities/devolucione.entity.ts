import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
 
@Entity('devoluciones')
export class Devolucion {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'int' })
  cantidad: number;
 
  @Column({ length: 200 })
  motivo: string;
 
  @CreateDateColumn()
  fecha: Date;
 
  @ManyToOne(() => Venta, { nullable: false })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;
 
  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
 
  // Quien registra la devolución
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
 
  // Encargado o líder que la autoriza
  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'autorizada_por' })
  autorizadaPor: Usuario;
}
