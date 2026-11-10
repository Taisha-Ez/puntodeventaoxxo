"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("./entities/producto.entity");
const categoria_entity_1 = require("../categorias/entities/categoria.entity");
const proveedore_entity_1 = require("../proveedores/entities/proveedore.entity");
let ProductosService = class ProductosService {
    productoRepo;
    categoriaRepo;
    proveedorRepo;
    constructor(productoRepo, categoriaRepo, proveedorRepo) {
        this.productoRepo = productoRepo;
        this.categoriaRepo = categoriaRepo;
        this.proveedorRepo = proveedorRepo;
    }
    async create(dto) {
        const { categoriaId, proveedorId, ...datos } = dto;
        const existe = await this.productoRepo.findOneBy({ codigoBarras: datos.codigoBarras });
        if (existe)
            throw new common_1.ConflictException('Ya existe un producto con ese código de barras');
        this.validarPrecios(datos.precioCompra, datos.precioVenta);
        const producto = this.productoRepo.create({
            ...datos,
            categoria: await this.buscarCategoria(categoriaId),
            proveedor: proveedorId ? await this.buscarProveedor(proveedorId) : undefined,
        });
        return this.productoRepo.save(producto);
    }
    findAll(buscar) {
        const relaciones = { categoria: true, proveedor: true };
        if (!buscar) {
            return this.productoRepo.find({ where: { activo: true }, relations: relaciones, order: { nombre: 'ASC' } });
        }
        return this.productoRepo.find({
            where: [
                { activo: true, nombre: (0, typeorm_2.Like)(`%${buscar}%`) },
                { activo: true, codigoBarras: (0, typeorm_2.Like)(`%${buscar}%`) },
            ],
            relations: relaciones,
            order: { nombre: 'ASC' },
        });
    }
    async findByCodigo(codigoBarras) {
        const producto = await this.productoRepo.findOne({
            where: { codigoBarras, activo: true },
            relations: { categoria: true },
        });
        if (!producto)
            throw new common_1.NotFoundException(`No existe un producto con código ${codigoBarras}`);
        return producto;
    }
    findStockBajo() {
        return this.productoRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.proveedor', 'proveedor')
            .where('p.activo = :activo', { activo: true })
            .andWhere('p.stockActual <= p.stockMinimo')
            .orderBy('p.stockActual', 'ASC')
            .getMany();
    }
    async findOne(id) {
        const producto = await this.productoRepo.findOne({
            where: { id },
            relations: { categoria: true, proveedor: true },
        });
        if (!producto)
            throw new common_1.NotFoundException(`Producto ${id} no encontrado`);
        return producto;
    }
    async update(id, dto) {
        const producto = await this.findOne(id);
        const { categoriaId, proveedorId, ...datos } = dto;
        if (datos.codigoBarras && datos.codigoBarras !== producto.codigoBarras) {
            const existe = await this.productoRepo.findOneBy({ codigoBarras: datos.codigoBarras });
            if (existe)
                throw new common_1.ConflictException('Ya existe un producto con ese código de barras');
        }
        if (categoriaId)
            producto.categoria = await this.buscarCategoria(categoriaId);
        if (proveedorId)
            producto.proveedor = await this.buscarProveedor(proveedorId);
        Object.assign(producto, datos);
        this.validarPrecios(producto.precioCompra, producto.precioVenta);
        return this.productoRepo.save(producto);
    }
    async remove(id) {
        const producto = await this.findOne(id);
        producto.activo = false;
        await this.productoRepo.save(producto);
        return { mensaje: 'Producto desactivado' };
    }
    validarPrecios(precioCompra, precioVenta) {
        if (precioVenta < precioCompra) {
            throw new common_1.BadRequestException('El precio de venta no puede ser menor al de compra');
        }
    }
    async buscarCategoria(id) {
        const categoria = await this.categoriaRepo.findOneBy({ id, activo: true });
        if (!categoria)
            throw new common_1.NotFoundException(`Categoría ${id} no encontrada`);
        return categoria;
    }
    async buscarProveedor(id) {
        const proveedor = await this.proveedorRepo.findOneBy({ id, activo: true });
        if (!proveedor)
            throw new common_1.NotFoundException(`Proveedor ${id} no encontrado`);
        return proveedor;
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(1, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __param(2, (0, typeorm_1.InjectRepository)(proveedore_entity_1.Proveedor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductosService);
//# sourceMappingURL=productos.service.js.map