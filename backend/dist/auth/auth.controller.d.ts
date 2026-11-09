import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { UsuarioToken } from './interfaces/usuario-token.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: number;
            nombre: string;
            usuario: string;
            rol: string;
        };
    }>;
    perfil(usuario: UsuarioToken): UsuarioToken;
}
