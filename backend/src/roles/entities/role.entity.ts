import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
 
@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ length: 30, unique: true })
  nombre: string; // ayudante, encargado, lider
 
  @Column({ length: 150, nullable: true })
  descripcion: string;
 
  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
