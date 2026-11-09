export type RolNombre = 'ayudante' | 'encargado' | 'lider';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RolNombre[]) => import("@nestjs/common", { with: { "resolution-mode": "import" } }).CustomDecorator<string>;
