import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from '../auth/decorators/roles.decorator';
 
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
 
  // Lo usa el líder para elegir el rol al crear un usuario
  @Roles('lider')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
