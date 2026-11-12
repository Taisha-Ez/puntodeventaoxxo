import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EstadoTurno, TurnoCaja } from './entities/turnos-caja.entity';
import { Caja } from '../cajas/entities/caja.entity';
import { EstadoVenta, Venta } from '../ventas/entities/venta.entity';
import { PagoVenta } from '../ventas/entities/pago-venta.entity';
import { AbrirTurnoDto } from './dto/create-turnos-caja.dto';
import { CerrarTurnoDto } from './dto/update-turnos-caja.dto';
import { redondear } from '../common/utils/redondear';
 
@Injectable()
export class TurnosCajaService {
  constructor(
    @InjectRepository(TurnoCaja) private readonly turnoRepo: Repository<TurnoCaja>,
    private readonly dataSource: DataSource,
  ) {}
 
  async abrir(dto: AbrirTurnoDto, usuarioId: number) {
    const yaAbierto = await this.buscarTurnoAbierto(usuarioId);
    if (yaAbierto) throw new BadRequestException('Ya tienes un turno abierto; ciérralo antes de abrir otro');
 
    const caja = await this.dataSource.getRepository(Caja).findOneBy({ id: dto.cajaId, activa: true });
    if (!caja) throw new NotFoundException(`Caja ${dto.cajaId} no encontrada`);
 
    const cajaOcupada = await this.turnoRepo.findOne({
      where: { caja: { id: dto.cajaId }, estado: EstadoTurno.ABIERTO },
    });
    if (cajaOcupada) throw new ConflictException(`La caja ${caja.numero} ya tiene un turno abierto`);
 
    const turno = this.turnoRepo.create({
      caja,
      usuario: { id: usuarioId },
      montoInicial: dto.montoInicial,
    });
    return this.turnoRepo.save(turno);
  }
 
  async miTurno(usuarioId: number) {
    const turno = await this.buscarTurnoAbierto(usuarioId);
    if (!turno) throw new NotFoundException('No tienes un turno abierto');
    return { turno, resumen: await this.calcularResumen(turno) };
  }
 
  // Corte de caja
  async cerrar(dto: CerrarTurnoDto, usuarioId: number) {
    const turno = await this.buscarTurnoAbierto(usuarioId);
    if (!turno) throw new NotFoundException('No tienes un turno abierto');
 
    const resumen = await this.calcularResumen(turno);
    turno.montoFinal = dto.montoFinal;
    // Positivo = sobrante, negativo = faltante
    turno.diferencia = redondear(dto.montoFinal - resumen.efectivoEsperado);
    turno.fechaCierre = new Date();
    turno.estado = EstadoTurno.CERRADO;
    await this.turnoRepo.save(turno);
 
    return { turno, resumen };
  }
 
  findAll() {
    return this.turnoRepo.find({
      relations: { caja: true, usuario: true },
      order: { fechaApertura: 'DESC' },
      take: 100,
    });
  }
 
  async findOne(id: number) {
    const turno = await this.turnoRepo.findOne({ where: { id }, relations: { caja: true, usuario: true } });
    if (!turno) throw new NotFoundException(`Turno ${id} no encontrado`);
    return { turno, resumen: await this.calcularResumen(turno) };
  }
 
  private buscarTurnoAbierto(usuarioId: number) {
    return this.turnoRepo.findOne({
      where: { usuario: { id: usuarioId }, estado: EstadoTurno.ABIERTO },
      relations: { caja: true },
    });
  }
 
  // Cuánto se vendió en el turno y cuánto efectivo debería haber en la caja
  private async calcularResumen(turno: TurnoCaja) {
    const ventas = await this.dataSource
      .getRepository(Venta)
      .createQueryBuilder('v')
      .innerJoin('v.turno', 't')
      .select('COUNT(v.id)', 'numVentas')
      .addSelect('COALESCE(SUM(v.total), 0)', 'totalVendido')
      .where('t.id = :id', { id: turno.id })
      .andWhere('v.estado = :estado', { estado: EstadoVenta.PAGADA })
      .getRawOne<{ numVentas: string; totalVendido: string }>();
 
    // Efectivo que realmente quedó en caja: lo pagado en efectivo menos el cambio entregado
    const efectivo = await this.dataSource
      .getRepository(PagoVenta)
      .createQueryBuilder('p')
      .innerJoin('p.venta', 'v')
      .innerJoin('v.turno', 't')
      .innerJoin('p.metodoPago', 'm')
      .select('COALESCE(SUM(p.monto - p.cambio), 0)', 'efectivo')
      .where('t.id = :id', { id: turno.id })
      .andWhere('v.estado = :estado', { estado: EstadoVenta.PAGADA })
      .andWhere('m.nombre = :metodo', { metodo: 'efectivo' })
      .getRawOne<{ efectivo: string }>();
 
    const efectivoVentas = redondear(Number(efectivo?.efectivo ?? 0));
    return {
      numVentas: Number(ventas?.numVentas ?? 0),
      totalVendido: redondear(Number(ventas?.totalVendido ?? 0)),
      efectivoVentas,
      efectivoEsperado: redondear(turno.montoInicial + efectivoVentas),
    };
  }
}
