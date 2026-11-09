import { Rol } from '../../roles/entities/role.entity';
export declare class Usuario {
    id: number;
    nombre: string;
    usuario: string;
    password: string;
    activo: boolean;
    fechaCreacion: Date;
    rol: Rol;
}
