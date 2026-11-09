import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare class Rol {
    id: number;
    nombre: string;
    descripcion: string;
    usuarios: Usuario[];
}
