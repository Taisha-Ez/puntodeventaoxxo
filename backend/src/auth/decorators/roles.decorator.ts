import { SetMetadata } from '@nestjs/common';

export type RolNombre = 'ayudante' | 'encargado' | 'lider';

export const ROLES_KEY = 'roles';
// Indica qué roles pueden usar una ruta
export const Roles = (...roles: RolNombre[]) => SetMetadata(ROLES_KEY, roles);