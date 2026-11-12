import { DataSource, Repository } from 'typeorm';
import { TurnoCaja } from './entities/turnos-caja.entity';
import { AbrirTurnoDto } from './dto/create-turnos-caja.dto';
import { CerrarTurnoDto } from './dto/update-turnos-caja.dto';
export declare class TurnosCajaService {
    private readonly turnoRepo;
    private readonly dataSource;
    constructor(turnoRepo: Repository<TurnoCaja>, dataSource: DataSource);
    abrir(dto: AbrirTurnoDto, usuarioId: number): Promise<TurnoCaja>;
    miTurno(usuarioId: number): Promise<{
        turno: TurnoCaja;
        resumen: {
            numVentas: number;
            totalVendido: number;
            efectivoVentas: number;
            efectivoEsperado: number;
        };
    }>;
    cerrar(dto: CerrarTurnoDto, usuarioId: number): Promise<{
        turno: TurnoCaja;
        resumen: {
            numVentas: number;
            totalVendido: number;
            efectivoVentas: number;
            efectivoEsperado: number;
        };
    }>;
    findAll(): Promise<TurnoCaja[]>;
    findOne(id: number): Promise<{
        turno: TurnoCaja;
        resumen: {
            numVentas: number;
            totalVendido: number;
            efectivoVentas: number;
            efectivoEsperado: number;
        };
    }>;
    private buscarTurnoAbierto;
    private calcularResumen;
}
