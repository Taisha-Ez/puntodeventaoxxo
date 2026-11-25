import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioToken } from '../interfaces/usuario-token.interface';

interface JwtPayload {
  sub: number;
  usuario: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Lo que regresa aquí queda disponible como request.user
  // Se consulta la BD en cada petición: si el usuario se desactiva, el token deja de servir al instante
  async validate(payload: JwtPayload): Promise<UsuarioToken> {
    const activo = await this.usuarioRepo.exists({ where: { id: payload.sub, activo: true } });
    if (!activo) throw new UnauthorizedException('Usuario desactivado o inexistente');
    return { id: payload.sub, usuario: payload.usuario, rol: payload.rol };
  }
}