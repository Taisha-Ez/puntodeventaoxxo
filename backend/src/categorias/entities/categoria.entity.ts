import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ length: 60, unique: true })
  nombre: string;
 
  @Column({ default: true })
  activo: boolean;
}
