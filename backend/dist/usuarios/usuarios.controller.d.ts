import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    create(dto: CreateUsuarioDto): Promise<import("./entities/usuario.entity").Usuario>;
    findAll(): Promise<import("./entities/usuario.entity").Usuario[]>;
    findOne(id: number): Promise<import("./entities/usuario.entity").Usuario>;
    update(id: number, dto: UpdateUsuarioDto, actual: UsuarioToken): Promise<import("./entities/usuario.entity").Usuario>;
    remove(id: number, actual: UsuarioToken): Promise<{
        mensaje: string;
    }>;
}
