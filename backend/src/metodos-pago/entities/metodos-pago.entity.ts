import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity('metodos_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ length: 30, unique: true })
  nombre: string; // efectivo, tarjeta, transferencia
 
  @Column({ default: true })
  activo: boolean;
}
