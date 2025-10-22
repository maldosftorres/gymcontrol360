import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Pago } from '../../database/entities/pago.entity';
import { Socio } from '../../database/entities/socio.entity';
import { Membresia } from '../../database/entities/membresia.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { MetodoPago } from '../../common/enums/sistema.enum';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagosRepository: Repository<Pago>,
    @InjectRepository(Socio)
    private readonly socioRepository: Repository<Socio>,
    @InjectRepository(Membresia)
    private readonly membresiaRepository: Repository<Membresia>,
  ) {}

  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    // Verificar que el socio existe
    const socio = await this.socioRepository.findOne({
      where: { id: createPagoDto.socioId }
    });

    if (!socio) {
      throw new NotFoundException('Socio no encontrado');
    }

    // Verificar membresía si se proporciona
    if (createPagoDto.membresiaId) {
      const membresia = await this.membresiaRepository.findOne({
        where: { id: createPagoDto.membresiaId, activa: true }
      });

      if (!membresia) {
        throw new NotFoundException('Membresía no encontrada');
      }
    }

    const pagoData = {
      ...createPagoDto,
      metodoPago: createPagoDto.metodoPago || MetodoPago.EFECTIVO,
      esParcial: createPagoDto.esParcial || false,
      fechaPago: createPagoDto.fechaPago ? new Date(createPagoDto.fechaPago) : new Date(),
    };

    const pago = this.pagosRepository.create(pagoData);
    return await this.pagosRepository.save(pago);
  }

  async findAll(empresaId?: number, sedeId?: number, fechaInicio?: string, fechaFin?: string): Promise<Pago[]> {
    const queryBuilder = this.pagosRepository.createQueryBuilder('pago')
      .leftJoinAndSelect('pago.socio', 'socio')
      .leftJoinAndSelect('socio.usuario', 'usuario')
      .leftJoinAndSelect('pago.membresia', 'membresia')
      .leftJoinAndSelect('pago.empresa', 'empresa')
      .leftJoinAndSelect('pago.sede', 'sede');

    if (empresaId) {
      queryBuilder.andWhere('pago.empresaId = :empresaId', { empresaId });
    }

    if (sedeId) {
      queryBuilder.andWhere('pago.sedeId = :sedeId', { sedeId });
    }

    if (fechaInicio && fechaFin) {
      queryBuilder.andWhere('pago.fechaPago BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin + ' 23:59:59')
      });
    }

    return await queryBuilder
      .orderBy('pago.fechaPago', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Pago> {
    const pago = await this.pagosRepository.findOne({
      where: { id },
      relations: ['socio', 'socio.usuario', 'membresia', 'empresa', 'sede'],
    });

    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }

    return pago;
  }

  async findBySocio(socioId: number): Promise<Pago[]> {
    return await this.pagosRepository.find({
      where: { socioId },
      relations: ['membresia', 'empresa', 'sede'],
      order: { fechaPago: 'DESC' },
    });
  }

  async update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    const pago = await this.findOne(id);

    if (updatePagoDto.fechaPago) {
      updatePagoDto.fechaPago = new Date(updatePagoDto.fechaPago) as any;
    }

    await this.pagosRepository.update(id, updatePagoDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const pago = await this.findOne(id);
    await this.pagosRepository.remove(pago);
    return { message: 'Pago eliminado correctamente' };
  }

  // Reportes y estadísticas
  async getResumenPagos(empresaId?: number, fechaInicio?: string, fechaFin?: string) {
    const queryBuilder = this.pagosRepository.createQueryBuilder('pago');

    if (empresaId) {
      queryBuilder.where('pago.empresaId = :empresaId', { empresaId });
    }

    if (fechaInicio && fechaFin) {
      queryBuilder.andWhere('pago.fechaPago BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin + ' 23:59:59')
      });
    }

    const result = await queryBuilder
      .select([
        'COUNT(*) as totalPagos',
        'SUM(pago.monto) as totalMonto',
        'AVG(pago.monto) as promedioMonto',
        'pago.metodoPago',
        'COUNT(CASE WHEN pago.esParcial = true THEN 1 END) as pagosParciales'
      ])
      .groupBy('pago.metodoPago')
      .getRawMany();

    return result;
  }

  async getPagosPorPeriodo(periodo: 'dia' | 'mes' | 'año', empresaId?: number) {
    let dateFormat;
    switch (periodo) {
      case 'dia':
        dateFormat = '%Y-%m-%d';
        break;
      case 'mes':
        dateFormat = '%Y-%m';
        break;
      case 'año':
        dateFormat = '%Y';
        break;
    }

    const queryBuilder = this.pagosRepository.createQueryBuilder('pago');

    if (empresaId) {
      queryBuilder.where('pago.empresaId = :empresaId', { empresaId });
    }

    return await queryBuilder
      .select([
        `DATE_FORMAT(pago.fechaPago, '${dateFormat}') as periodo`,
        'COUNT(*) as cantidadPagos',
        'SUM(pago.monto) as totalMonto'
      ])
      .groupBy('periodo')
      .orderBy('periodo', 'DESC')
      .limit(12) // Últimos 12 períodos
      .getRawMany();
  }

  async getTotalPagosHoy(empresaId?: number): Promise<{ cantidad: number; monto: number }> {
    const hoy = new Date();
    const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    const queryBuilder = this.pagosRepository.createQueryBuilder('pago')
      .where('pago.fechaPago BETWEEN :inicio AND :fin', {
        inicio: inicioDelDia,
        fin: finDelDia
      });

    if (empresaId) {
      queryBuilder.andWhere('pago.empresaId = :empresaId', { empresaId });
    }

    const result = await queryBuilder
      .select([
        'COUNT(*) as cantidad',
        'COALESCE(SUM(pago.monto), 0) as monto'
      ])
      .getRawOne();

    return {
      cantidad: parseInt(result.cantidad),
      monto: parseFloat(result.monto)
    };
  }
}