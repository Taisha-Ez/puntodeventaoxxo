import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RolNombre } from '../decorators/roles.decorator';
import { UsuarioToken } from '../interfaces/usuario-token.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<RolNombre[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Si la ruta no tiene @Roles, basta con haber iniciado sesión
    if (!rolesPermitidos || rolesPermitidos.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<{ user?: UsuarioToken }>();
    if (!user || !rolesPermitidos.includes(user.rol as RolNombre)) {
      throw new ForbiddenException('No tienes permiso para realizar esta acción');
    }
    return true;
  }
}