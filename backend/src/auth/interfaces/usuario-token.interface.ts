// Datos que viajan dentro del token y que llegan en cada petición
export interface UsuarioToken {
  id: number;
  usuario: string;
  rol: string;
}