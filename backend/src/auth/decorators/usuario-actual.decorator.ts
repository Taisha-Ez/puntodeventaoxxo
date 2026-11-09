import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioToken } from '../interfaces/usuario-token.interface';

// Permite recibir en el controlador al usuario que hizo la petición
export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UsuarioToken => {
    const request = ctx.switchToHttp().getRequest<{ user: UsuarioToken }>();
    return request.user;
  },
);