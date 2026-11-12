import { TurnosCajaService } from './turnos-caja.service';
import { AbrirTurnoDto } from './dto/create-turnos-caja.dto';
import { CerrarTurnoDto } from './dto/update-turnos-caja.dto';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
export declare class TurnosCajaController {
    private readonly turnosService;
    constructor(turnosService: TurnosCajaService);
    abrir(dto: AbrirTurnoDto, usuario: UsuarioToken): Promise<import("./entities/turnos-caja.entity").TurnoCaja>;
    miTurno(usuario: UsuarioToken): Promise<{
        turno: import("./entities/turnos-caja.entity").TurnoCaja;
        resumen: {
            numVentas: number;
            totalVendido: number;
            efectivoVentas: number;
            efectivoEsperado: number;
        };
    }>;
    cerrar(dto: CerrarTurnoDto, usuario: UsuarioToken): Promise<{
        turno: import("./entities/turnos-caja.entity").TurnoCaja;
        resumen: {
            numVentas: number;
            totalVendido: number;
            efectivoVentas: number;
            efectivoEsperado: number;
        };
    }>;
    findAll(): Promise<import("./entities/turnos-caja.entity").TurnoCaja[]>;
    findOne(id: number): Promise<{
        turno: import("./entities/turnos-caja.entity").TurnoCaja;
        resumen: {
            numVentas: number;
            totalVendido: number;
            efectivoVentas: number;
            efectivoEsperado: number;
        };
    }>;
}
