import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../roles/entities/role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MetodoPago } from '../metodos-pago/entities/metodos-pago.entity';
import { Caja } from '../cajas/entities/caja.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(MetodoPago) private readonly metodoRepo: Repository<MetodoPago>,
    @InjectRepository(Caja) private readonly cajaRepo: Repository<Caja>,
  ) {}

  async onModuleInit() {
    // Si ya hay roles, la base ya tiene datos iniciales
    if ((await this.rolRepo.count()) > 0) return;

    const roles = await this.rolRepo.save([
      { nombre: 'ayudante', descripcion: 'Cobra ventas y consulta productos' },
      { nombre: 'encargado', descripcion: 'Inventario, compras, devoluciones y cortes' },
      { nombre: 'lider', descripcion: 'Administra todo el sistema' },
    ]);

    await this.metodoRepo.save([
      { nombre: 'efectivo' },
      { nombre: 'tarjeta' },
      { nombre: 'transferencia' },
    ]);

    await this.cajaRepo.save({ numero: 1 });

    await this.usuarioRepo.save({
      nombre: 'Administrador',
      usuario: 'admin',
      password: await bcrypt.hash('admin123', 10),
      rol: roles.find((r) => r.nombre === 'lider'),
    });

    this.logger.log('Datos iniciales creados (usuario: admin / contraseña: admin123)');
  }
}