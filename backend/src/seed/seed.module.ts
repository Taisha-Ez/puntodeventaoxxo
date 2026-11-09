import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RolesModule } from '../roles/roles.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MetodosPagoModule } from '../metodos-pago/metodos-pago.module';
import { CajasModule } from '../cajas/cajas.module';

@Module({
  imports: [RolesModule, UsuariosModule, MetodosPagoModule, CajasModule],
  providers: [SeedService],
})
export class SeedModule {}