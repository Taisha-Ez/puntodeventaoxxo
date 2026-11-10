import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
export declare class CategoriasController {
    private readonly categoriasService;
    constructor(categoriasService: CategoriasService);
    create(dto: CreateCategoriaDto): Promise<import("./entities/categoria.entity").Categoria>;
    findAll(): Promise<import("./entities/categoria.entity").Categoria[]>;
    findOne(id: number): Promise<import("./entities/categoria.entity").Categoria>;
    update(id: number, dto: UpdateCategoriaDto): Promise<import("./entities/categoria.entity").Categoria>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
