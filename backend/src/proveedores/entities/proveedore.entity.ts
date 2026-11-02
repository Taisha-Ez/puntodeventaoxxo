import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ length: 100 })
  nombre: string;
 
  @Column({ length: 20, nullable: true })
  telefono: string;
 
  @Column({ length: 100, nullable: true })
  email: string;
 
  @Column({ length: 13, nullable: true })
  rfc: string;
 
  @Column({ default: true })
  activo: boolean;
}
