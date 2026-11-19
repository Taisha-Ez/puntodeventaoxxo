import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// Plantilla de la tienda: máximo de usuarios ACTIVOS por rol
export const PLANTILLA: Record<string, number> = {
  lider: 1,
  encargado: 2,
  ayudante: 4,
};
 
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
  ) {}
 
  async create(dto: CreateUsuarioDto) {
    const { rolId, password, ...datos } = dto;
    await this.validarUsuarioLibre(datos.usuario);
    const rol = await this.buscarRol(rolId);
    await this.validarCupo(rol);
 
    const usuario = this.usuarioRepo.create({
      ...datos,
      password: await bcrypt.hash(password, 10),
      rol,
    });
    const guardado = await this.usuarioRepo.save(usuario);
    // Se vuelve a consultar para regresarlo SIN la contraseña
    return this.findOne(guardado.id);
  }
 
  // Cuántos activos hay de cada rol contra lo que permite la plantilla
  async plantilla() {
    const activos = await this.usuarioRepo.find({ where: { activo: true } });
    return Object.entries(PLANTILLA).map(([rol, maximo]) => {
      const ocupados = activos.filter((u) => u.rol?.nombre === rol).length;
      return { rol, maximo, activos: ocupados, disponibles: Math.max(maximo - ocupados, 0) };
    });
  }

  findAll() {
    return this.usuarioRepo.find({ order: { nombre: 'ASC' } });
  }
 
  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return usuario;
  }
 
  async update(id: number, dto: UpdateUsuarioDto, idUsuarioActual: number) {
    const usuario = await this.findOne(id);
    const { rolId, password, ...datos } = dto;
    const estabaActivo = usuario.activo;
    const rolAnterior = usuario.rol;

    if (datos.usuario && datos.usuario !== usuario.usuario) {
      await this.validarUsuarioLibre(datos.usuario);
    }
 
    if (rolId) {
      const rol = await this.buscarRol(rolId);
      // Evita que el líder se quite su propio rol y se quede sin acceso
      if (id === idUsuarioActual && rol.nombre !== 'lider') {
        throw new BadRequestException('No puedes quitarte el rol de líder a ti mismo');
      }
      usuario.rol = rol;
    }
 
    if (id === idUsuarioActual && datos.activo === false) {
      throw new BadRequestException('No puedes desactivar tu propia cuenta');
    }
 
    // Si queda activo con un rol nuevo, o se reactiva, debe haber lugar en la plantilla
    const quedaActivo = datos.activo ?? usuario.activo;
    const cambioRol = usuario.rol.id !== rolAnterior.id;
    if (quedaActivo && (!estabaActivo || cambioRol)) {
      await this.validarCupo(usuario.rol, id);
    }

    if (password) usuario.password = await bcrypt.hash(password, 10);
 
    Object.assign(usuario, datos);
    await this.usuarioRepo.save(usuario);
    return this.findOne(id);
  }
 
  async remove(id: number, idUsuarioActual: number) {
    if (id === idUsuarioActual) {
      throw new BadRequestException('No puedes desactivar tu propia cuenta');
    }
    const usuario = await this.findOne(id);
    usuario.activo = false;
    await this.usuarioRepo.save(usuario);
    return { mensaje: 'Usuario desactivado' };
  }
 
  private async validarUsuarioLibre(nombreUsuario: string) {
    const existe = await this.usuarioRepo.findOneBy({ usuario: nombreUsuario });
    if (existe) throw new ConflictException('Ese nombre de usuario ya está en uso');
  }
 
  private async validarCupo(rol: Rol, excluirId?: number) {
    const maximo = PLANTILLA[rol.nombre];
    if (maximo === undefined) return;
    const activos = await this.usuarioRepo.find({ where: { activo: true, rol: { id: rol.id } } });
    const ocupados = activos.filter((u) => u.id !== excluirId).length;
    if (ocupados >= maximo) {
      throw new BadRequestException(
        `La plantilla ya está completa: solo se permiten ${maximo} ${rol.nombre}(s) activo(s). Desactiva uno antes de agregar otro.`,
      );
    }
  }

  private async buscarRol(id: number) {
    const rol = await this.rolRepo.findOneBy({ id });
    if (!rol) throw new NotFoundException(`Rol ${id} no encontrado`);
    return rol;
  }
}
