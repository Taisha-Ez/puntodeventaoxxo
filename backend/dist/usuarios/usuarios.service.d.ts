import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosService {
    private readonly usuarioRepo;
    private readonly rolRepo;
    constructor(usuarioRepo: Repository<Usuario>, rolRepo: Repository<Rol>);
    create(dto: CreateUsuarioDto): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    update(id: number, dto: UpdateUsuarioDto, idUsuarioActual: number): Promise<Usuario>;
    remove(id: number, idUsuarioActual: number): Promise<{
        mensaje: string;
    }>;
    private validarUsuarioLibre;
    private buscarRol;
}
