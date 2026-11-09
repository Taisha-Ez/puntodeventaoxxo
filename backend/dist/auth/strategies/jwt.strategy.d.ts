import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UsuarioToken } from '../interfaces/usuario-token.interface';
interface JwtPayload {
    sub: number;
    usuario: string;
    rol: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtPayload): UsuarioToken;
}
export {};
