import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/role.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
 
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
  ) {}
 
  async create(dto: CreateUsuarioDto) {
    const { rolId, password, ...datos } = dto;
    await this.validarUsuarioLibre(datos.usuario);
 
    const usuario = this.usuarioRepo.create({
      ...datos,
      password: await bcrypt.hash(password, 10),
      rol: await this.buscarRol(rolId),
    });
    const guardado = await this.usuarioRepo.save(usuario);
    // Se vuelve a consultar para regresarlo SIN la contraseña
    return this.findOne(guardado.id);
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
 
  private async buscarRol(id: number) {
    const rol = await this.rolRepo.findOneBy({ id });
    if (!rol) throw new NotFoundException(`Rol ${id} no encontrado`);
    return rol;
  }
}
