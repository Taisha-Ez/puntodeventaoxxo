import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity('cajas')
export class Caja {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'int', unique: true })
  numero: number;
 
  @Column({ default: true })
  activa: boolean;
}
