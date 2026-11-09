import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ usuario, password }: LoginDto) {
    // password tiene select: false, por eso se pide explícitamente con addSelect
    const user = await this.usuarioRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .leftJoinAndSelect('u.rol', 'rol')
      .where('u.usuario = :usuario', { usuario })
      .andWhere('u.activo = :activo', { activo: true })
      .getOne();

    // Mismo mensaje en ambos casos para no revelar si el usuario existe
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload = { sub: user.id, usuario: user.usuario, rol: user.rol.nombre };

    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol.nombre,
      },
    };
  }
}