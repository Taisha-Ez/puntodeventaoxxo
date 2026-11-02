import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import { Rol } from '../../roles/entities/role.entity';
 
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ length: 100 })
  nombre: string;
 
  @Column({ length: 50, unique: true })
  usuario: string;
 
  @Column({ select: false }) // no se devuelve en las consultas por seguridad
  password: string;
 
  @Column({ default: true })
  activo: boolean;
 
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;
 
  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true, nullable: false })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
}
