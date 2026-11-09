import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usuarioRepo;
    private readonly jwtService;
    constructor(usuarioRepo: Repository<Usuario>, jwtService: JwtService);
    login({ usuario, password }: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: number;
            nombre: string;
            usuario: string;
            rol: string;
        };
    }>;
}
