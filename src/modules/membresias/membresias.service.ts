import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan } from 'typeorm';
import { Membresia } from '../../database/entities/membresia.entity';
import { SocioMembresia } from '../../database/entities/socio-membresia.entity';
import { Socio } from '../../database/entities/socio.entity';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';
import { AsignarMembresiaDto, UpdateSocioMembresiaDto } from './dto/asignar-membresia.dto';
import { MembresiaEstado } from '../../common/enums/membresia.enum';

@Injectable()
export class MembresiasService {
  constructor(
    @InjectRepository(Membresia)
    private readonly membresiaRepository: Repository<Membresia>,
    @InjectRepository(SocioMembresia)
    private readonly socioMembresiaRepository: Repository<SocioMembresia>,
    @InjectRepository(Socio)
    private readonly socioRepository: Repository<Socio>,
    private readonly dataSource: DataSource,
  ) {}

  // CRUD de Membresías
  async create(createMembresiaDto: CreateMembresiaDto) {
    const membresia = this.membresiaRepository.create({
      ...createMembresiaDto,
      activa: true,
    });

    return await this.membresiaRepository.save(membresia);
  }

  async findAll(empresaId?: number, sedeId?: number) {
    const queryBuilder = this.membresiaRepository.createQueryBuilder('membresia')
      .leftJoinAndSelect('membresia.empresa', 'empresa')
      .leftJoinAndSelect('membresia.sede', 'sede')
      .where('membresia.activa = :activa', { activa: true });

    if (empresaId) {
      queryBuilder.andWhere('membresia.empresaId = :empresaId', { empresaId });
    }

    if (sedeId) {
      queryBuilder.andWhere('membresia.sedeId = :sedeId', { sedeId });
    }

    return await queryBuilder
      .orderBy('membresia.nombre', 'ASC')
      .getMany();
  }

  async findOne(id: number) {
    const membresia = await this.membresiaRepository.findOne({
      where: { id, activa: true },
      relations: ['empresa', 'sede', 'sociosMembresias'],
    });

    if (!membresia) {
      throw new NotFoundException('Membresía no encontrada');
    }

    return membresia;
  }

  async update(id: number, updateMembresiaDto: UpdateMembresiaDto) {
    const membresia = await this.findOne(id);
    
    await this.membresiaRepository.update(id, updateMembresiaDto);
    
    return await this.findOne(id);
  }

  async remove(id: number) {
    const membresia = await this.findOne(id);

    // Verificar si tiene socios asignados activos
    const sociosActivos = await this.socioMembresiaRepository.count({
      where: { 
        membresiaId: id, 
        estado: MembresiaEstado.ACTIVA 
      }
    });

    if (sociosActivos > 0) {
      throw new BadRequestException('No se puede eliminar una membresía con socios activos');
    }

    // Soft delete
    await this.membresiaRepository.update(id, { activa: false });

    return { message: 'Membresía eliminada correctamente' };
  }

  // Asignación de membresías a socios
  async asignarMembresia(asignarMembresiaDto: AsignarMembresiaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar que el socio existe
      const socio = await this.socioRepository.findOne({
        where: { id: asignarMembresiaDto.socioId }
      });

      if (!socio) {
        throw new NotFoundException('Socio no encontrado');
      }

      // Verificar que la membresía existe
      const membresia = await this.membresiaRepository.findOne({
        where: { id: asignarMembresiaDto.membresiaId, activa: true }
      });

      if (!membresia) {
        throw new NotFoundException('Membresía no encontrada');
      }

      // Suspender membresías activas del socio
      await queryRunner.manager.update(SocioMembresia, 
        { 
          socioId: asignarMembresiaDto.socioId, 
          estado: MembresiaEstado.ACTIVA 
        },
        { estado: MembresiaEstado.SUSPENDIDA }
      );

      // Calcular fecha de fin
      const fechaInicio = new Date(asignarMembresiaDto.fechaInicio);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + membresia.duracionDias);

      // Crear nueva asignación
      const socioMembresia = this.socioMembresiaRepository.create({
        empresaId: socio.empresaId,
        sedeId: socio.sedeId,
        socioId: asignarMembresiaDto.socioId,
        membresiaId: asignarMembresiaDto.membresiaId,
        fechaInicio,
        fechaFin,
        estado: MembresiaEstado.ACTIVA,
        notas: asignarMembresiaDto.notas,
      });

      const resultado = await queryRunner.manager.save(SocioMembresia, socioMembresia);

      await queryRunner.commitTransaction();

      return await this.socioMembresiaRepository.findOne({
        where: { id: resultado.id },
        relations: ['socio', 'membresia', 'empresa', 'sede'],
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findMembresiasSocio(socioId: number) {
    return await this.socioMembresiaRepository.find({
      where: { socioId },
      relations: ['membresia', 'empresa', 'sede'],
      order: { fechaInicio: 'DESC' }
    });
  }

  async findMembresiaActivaSocio(socioId: number) {
    return await this.socioMembresiaRepository.findOne({
      where: { 
        socioId, 
        estado: MembresiaEstado.ACTIVA 
      },
      relations: ['membresia', 'socio', 'empresa', 'sede'],
    });
  }

  async updateSocioMembresia(id: number, updateDto: UpdateSocioMembresiaDto) {
    const socioMembresia = await this.socioMembresiaRepository.findOne({
      where: { id },
      relations: ['membresia', 'socio']
    });

    if (!socioMembresia) {
      throw new NotFoundException('Asignación de membresía no encontrada');
    }

    // Si se cambia la fecha de inicio, recalcular fecha de fin
    if (updateDto.fechaInicio) {
      const fechaInicio = new Date(updateDto.fechaInicio);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + socioMembresia.membresia.duracionDias);
      updateDto.fechaFin = fechaFin.toISOString().split('T')[0];
    }

    await this.socioMembresiaRepository.update(id, updateDto);

    return await this.socioMembresiaRepository.findOne({
      where: { id },
      relations: ['membresia', 'socio', 'empresa', 'sede'],
    });
  }

  async getMembresiasPorVencer(dias: number = 7, empresaId?: number) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);

    const queryBuilder = this.socioMembresiaRepository.createQueryBuilder('sm')
      .leftJoinAndSelect('sm.socio', 'socio')
      .leftJoinAndSelect('sm.membresia', 'membresia')
      .leftJoinAndSelect('socio.usuario', 'usuario')
      .where('sm.estado = :estado', { estado: MembresiaEstado.ACTIVA })
      .andWhere('sm.fechaFin <= :fechaLimite', { fechaLimite });

    if (empresaId) {
      queryBuilder.andWhere('sm.empresaId = :empresaId', { empresaId });
    }

    return await queryBuilder
      .orderBy('sm.fechaFin', 'ASC')
      .getMany();
  }

  async actualizarEstadosVencidos() {
    const fechaActual = new Date();
    
    const resultado = await this.socioMembresiaRepository.update(
      {
        estado: MembresiaEstado.ACTIVA,
        fechaFin: LessThan(fechaActual)
      },
      { estado: MembresiaEstado.VENCIDA }
    );

    return {
      message: `Se actualizaron ${resultado.affected} membresías vencidas`,
      actualizadas: resultado.affected
    };
  }
}