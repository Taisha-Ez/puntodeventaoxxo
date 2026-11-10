import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedorDto } from './dto/update-proveedore.dto';
import { Roles } from '../auth/decorators/roles.decorator';
 
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}
 
  @Roles('lider')
  @Post()
  create(@Body() dto: CreateProveedoreDto) {
    return this.proveedoresService.create(dto);
  }
 
  // El encargado los consulta al registrar compras
  @Roles('encargado', 'lider')
  @Get()
  findAll() {
    return this.proveedoresService.findAll();
  }
 
  @Roles('encargado', 'lider')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.findOne(id);
  }
 
  @Roles('lider')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProveedorDto) {
    return this.proveedoresService.update(id, dto);
  }
 
  @Roles('lider')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.remove(id);
  }
}
