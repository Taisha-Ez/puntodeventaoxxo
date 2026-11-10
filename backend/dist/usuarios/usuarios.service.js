"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const usuario_entity_1 = require("./entities/usuario.entity");
const role_entity_1 = require("../roles/entities/role.entity");
let UsuariosService = class UsuariosService {
    usuarioRepo;
    rolRepo;
    constructor(usuarioRepo, rolRepo) {
        this.usuarioRepo = usuarioRepo;
        this.rolRepo = rolRepo;
    }
    async create(dto) {
        const { rolId, password, ...datos } = dto;
        await this.validarUsuarioLibre(datos.usuario);
        const usuario = this.usuarioRepo.create({
            ...datos,
            password: await bcrypt.hash(password, 10),
            rol: await this.buscarRol(rolId),
        });
        const guardado = await this.usuarioRepo.save(usuario);
        return this.findOne(guardado.id);
    }
    findAll() {
        return this.usuarioRepo.find({ order: { nombre: 'ASC' } });
    }
    async findOne(id) {
        const usuario = await this.usuarioRepo.findOneBy({ id });
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
        return usuario;
    }
    async update(id, dto, idUsuarioActual) {
        const usuario = await this.findOne(id);
        const { rolId, password, ...datos } = dto;
        if (datos.usuario && datos.usuario !== usuario.usuario) {
            await this.validarUsuarioLibre(datos.usuario);
        }
        if (rolId) {
            const rol = await this.buscarRol(rolId);
            if (id === idUsuarioActual && rol.nombre !== 'lider') {
                throw new common_1.BadRequestException('No puedes quitarte el rol de líder a ti mismo');
            }
            usuario.rol = rol;
        }
        if (id === idUsuarioActual && datos.activo === false) {
            throw new common_1.BadRequestException('No puedes desactivar tu propia cuenta');
        }
        if (password)
            usuario.password = await bcrypt.hash(password, 10);
        Object.assign(usuario, datos);
        await this.usuarioRepo.save(usuario);
        return this.findOne(id);
    }
    async remove(id, idUsuarioActual) {
        if (id === idUsuarioActual) {
            throw new common_1.BadRequestException('No puedes desactivar tu propia cuenta');
        }
        const usuario = await this.findOne(id);
        usuario.activo = false;
        await this.usuarioRepo.save(usuario);
        return { mensaje: 'Usuario desactivado' };
    }
    async validarUsuarioLibre(nombreUsuario) {
        const existe = await this.usuarioRepo.findOneBy({ usuario: nombreUsuario });
        if (existe)
            throw new common_1.ConflictException('Ese nombre de usuario ya está en uso');
    }
    async buscarRol(id) {
        const rol = await this.rolRepo.findOneBy({ id });
        if (!rol)
            throw new common_1.NotFoundException(`Rol ${id} no encontrado`);
        return rol;
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Rol)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map