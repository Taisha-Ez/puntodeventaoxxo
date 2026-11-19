import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caja } from './entities/caja.entity';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';

// Máximo de cajas ACTIVAS que puede tener la tienda
export const MAX_CAJAS_ACTIVAS = 3;

@Injectable()
export class CajasService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepo: Repository<Caja>,
  ) {}

  async create(dto: CreateCajaDto) {
    const existe = await this.cajaRepo.findOneBy({ numero: dto.numero });
    if (existe) {
      throw new ConflictException(
        existe.activa
          ? `Ya existe la caja ${dto.numero}`
          : `La caja ${dto.numero} ya existe pero está desactivada. Reactívala en lugar de crearla.`,
      );
    }
    await this.validarCupo();
    return this.cajaRepo.save(this.cajaRepo.create(dto));
  }

  findAll() {
    return this.cajaRepo.find({ where: { activa: true }, order: { numero: 'ASC' } });
  }

  // Activas e inactivas, para la pantalla de administración
  findTodas() {
    return this.cajaRepo.find({ order: { numero: 'ASC' } });
  }

  // Cuántas cajas activas hay contra el máximo permitido
  async cupo() {
    const activas = await this.cajaRepo.countBy({ activa: true });
    return {
      maximo: MAX_CAJAS_ACTIVAS,
      activas,
      disponibles: Math.max(MAX_CAJAS_ACTIVAS - activas, 0),
    };
  }

  async findOne(id: number) {
    const caja = await this.cajaRepo.findOneBy({ id });
    if (!caja) throw new NotFoundException(`Caja ${id} no encontrada`);
    return caja;
  }

  async update(id: number, dto: UpdateCajaDto) {
    const caja = await this.findOne(id);
    if (dto.numero && dto.numero !== caja.numero) {
      const existe = await this.cajaRepo.findOneBy({ numero: dto.numero });
      if (existe) throw new ConflictException(`Ya existe la caja ${dto.numero}`);
    }
    // Si se reactiva, debe haber lugar
    if (dto.activa === true && !caja.activa) {
      await this.validarCupo();
    }
    Object.assign(caja, dto);
    return this.cajaRepo.save(caja);
  }

  async remove(id: number) {
    const caja = await this.findOne(id);
    caja.activa = false;
    await this.cajaRepo.save(caja);
    return { mensaje: 'Caja desactivada' };
  }

  private async validarCupo() {
    const activas = await this.cajaRepo.countBy({ activa: true });
    if (activas >= MAX_CAJAS_ACTIVAS) {
      throw new BadRequestException(
        `Solo se permiten ${MAX_CAJAS_ACTIVAS} cajas activas. Desactiva una antes de agregar o reactivar otra.`,
      );
    }
  }
}
