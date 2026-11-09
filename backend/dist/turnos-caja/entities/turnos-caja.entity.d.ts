import { Caja } from '../../cajas/entities/caja.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare enum EstadoTurno {
    ABIERTO = "ABIERTO",
    CERRADO = "CERRADO"
}
export declare class TurnoCaja {
    id: number;
    fechaApertura: Date;
    fechaCierre: Date;
    montoInicial: number;
    montoFinal: number;
    diferencia: number;
    estado: EstadoTurno;
    caja: Caja;
    usuario: Usuario;
}
