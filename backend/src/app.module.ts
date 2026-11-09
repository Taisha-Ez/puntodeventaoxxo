import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ProductosModule } from './productos/productos.module';
import { PromocionesModule } from './promociones/promociones.module';
import { MovimientosInventarioModule } from './movimientos-inventario/movimientos-inventario.module';
import { ComprasModule } from './compras/compras.module';
import { CajasModule } from './cajas/cajas.module';
import { TurnosCajaModule } from './turnos-caja/turnos-caja.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';
import { VentasModule } from './ventas/ventas.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import { SeedModule } from './seed/seed.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    RolesModule,
    UsuariosModule,
    CategoriasModule,
    ProveedoresModule,
    ProductosModule,
    PromocionesModule,
    MovimientosInventarioModule,
    ComprasModule,
    CajasModule,
    TurnosCajaModule,
    MetodosPagoModule,
    VentasModule,
    DevolucionesModule,
    SeedModule,
    AuthModule,
  ],

  controllers: [AppController],

  providers: [
  AppService,
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
],
})
export class AppModule {}