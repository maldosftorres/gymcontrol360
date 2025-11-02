import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sede } from '../../database/entities/sede.entity';
import { CreateSedeDto, UpdateSedeDto } from './dto';

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>,
  ) {}

  async create(empresaId: number, createSedeDto: CreateSedeDto): Promise<Sede> {
    try {
      // Verificar si ya existe una sede con el mismo nombre en la empresa
      const sedeExistente = await this.sedeRepository.findOne({
        where: {
          empresaId,
          nombre: createSedeDto.nombre,
        },
      });

      if (sedeExistente) {
        throw new BadRequestException(`Ya existe una sede con el nombre '${createSedeDto.nombre}' en esta empresa`);
      }

      const sede = this.sedeRepository.create({
        ...createSedeDto,
        empresaId,
        activa: createSedeDto.activa ?? true,
      });

      return await this.sedeRepository.save(sede);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear la sede');
    }
  }

  async findAll(empresaId: number): Promise<Sede[]> {
    return await this.sedeRepository.find({
      where: { empresaId },
      relations: ['empresa'],
      order: { nombre: 'ASC' },
    });
  }

  async findAllActivas(empresaId: number): Promise<Sede[]> {
    return await this.sedeRepository.find({
      where: { 
        empresaId,
        activa: true,
      },
      relations: ['empresa'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(empresaId: number, id: number): Promise<Sede> {
    const sede = await this.sedeRepository.findOne({
      where: { id, empresaId },
      relations: ['empresa', 'usuarios'],
    });

    if (!sede) {
      throw new NotFoundException(`Sede con ID ${id} no encontrada`);
    }

    return sede;
  }

  async update(empresaId: number, id: number, updateSedeDto: UpdateSedeDto): Promise<Sede> {
    const sede = await this.findOne(empresaId, id);

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (updateSedeDto.nombre && updateSedeDto.nombre !== sede.nombre) {
      const sedeExistente = await this.sedeRepository.findOne({
        where: {
          empresaId,
          nombre: updateSedeDto.nombre,
        },
      });

      if (sedeExistente && sedeExistente.id !== id) {
        throw new BadRequestException(`Ya existe una sede con el nombre '${updateSedeDto.nombre}' en esta empresa`);
      }
    }

    Object.assign(sede, updateSedeDto);
    return await this.sedeRepository.save(sede);
  }

  async remove(empresaId: number, id: number): Promise<void> {
    const sede = await this.findOne(empresaId, id);

    // Verificar si tiene usuarios asociados
    if (sede.usuarios && sede.usuarios.length > 0) {
      throw new BadRequestException('No se puede eliminar la sede porque tiene usuarios asociados');
    }

    // Verificar si tiene socios asociados (usando query directa)
    const sociosCount = await this.sedeRepository
      .createQueryBuilder('sede')
      .leftJoin('socios', 'socio', 'socio.sede_id = sede.id')
      .where('sede.id = :id', { id })
      .select('COUNT(socio.id)', 'count')
      .getRawOne();

    if (sociosCount.count > 0) {
      throw new BadRequestException('No se puede eliminar la sede porque tiene socios asociados');
    }

    await this.sedeRepository.remove(sede);
  }

  async toggleActiva(empresaId: number, id: number): Promise<Sede> {
    const sede = await this.findOne(empresaId, id);
    sede.activa = !sede.activa;
    return await this.sedeRepository.save(sede);
  }

  async getStats(empresaId: number, id: number): Promise<{
    totalUsuarios: number;
    totalSocios: number;
    totalMembresias: number;
    usuariosActivos: number;
    sociosActivos: number;
  }> {
    const sede = await this.findOne(empresaId, id);

    const totalUsuarios = sede.usuarios?.length || 0;
    const usuariosActivos = sede.usuarios?.filter(u => u.activo).length || 0;

    // Obtener stats usando queries directas
    const sociosStats = await this.sedeRepository
      .createQueryBuilder('sede')
      .leftJoin('socios', 'socio', 'socio.sede_id = sede.id')
      .where('sede.id = :id', { id })
      .select([
        'COUNT(socio.id) as totalSocios',
        'SUM(CASE WHEN socio.estado = "ACTIVO" THEN 1 ELSE 0 END) as sociosActivos'
      ])
      .getRawOne();

    const membresiaStats = await this.sedeRepository
      .createQueryBuilder('sede')
      .leftJoin('membresias', 'membresia', 'membresia.sede_id = sede.id')
      .where('sede.id = :id', { id })
      .select('COUNT(membresia.id) as totalMembresias')
      .getRawOne();

    return {
      totalUsuarios,
      totalSocios: parseInt(sociosStats.totalSocios) || 0,
      totalMembresias: parseInt(membresiaStats.totalMembresias) || 0,
      usuariosActivos,
      sociosActivos: parseInt(sociosStats.sociosActivos) || 0,
    };
  }
}