import { Injectable } from '@nestjs/common';
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
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Lo que regresa aquí queda disponible como request.user
  validate(payload: JwtPayload): UsuarioToken {
    return { id: payload.sub, usuario: payload.usuario, rol: payload.rol };
  }
}