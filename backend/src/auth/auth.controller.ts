import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { UsuarioActual } from './decorators/usuario-actual.decorator';
import type { UsuarioToken } from './interfaces/usuario-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Sirve para probar el token: regresa quién eres
  @Get('perfil')
  perfil(@UsuarioActual() usuario: UsuarioToken) {
    return usuario;
  }
}