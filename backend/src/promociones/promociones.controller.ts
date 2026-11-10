import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocione.dto';
import { UpdatePromocionDto } from './dto/update-promocione.dto';
import { Roles } from '../auth/decorators/roles.decorator';
 
@Controller('promociones')
export class PromocionesController {
  constructor(private readonly promocionesService: PromocionesService) {}
 
  @Roles('lider')
  @Post()
  create(@Body() dto: CreatePromocionDto) {
    return this.promocionesService.create(dto);
  }
 
  @Get()
  findAll() {
    return this.promocionesService.findAll();
  }
 
  // Va antes de ':id'
  @Get('vigentes')
  findVigentes() {
    return this.promocionesService.findVigentes();
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.findOne(id);
  }
 
  @Roles('lider')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePromocionDto) {
    return this.promocionesService.update(id, dto);
  }
 
  @Roles('lider')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.remove(id);
  }
}
