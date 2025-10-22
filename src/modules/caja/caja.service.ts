import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Caja } from '../../database/entities/caja.entity';
import { MovimientoCaja } from '../../database/entities/movimiento-caja.entity';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { CreateMovimientoCajaDto } from './dto/create-movimiento-caja.dto';
import { CajaEstado, MovimientoTipo } from '../../common/enums/sistema.enum';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
    @InjectRepository(MovimientoCaja)
    private readonly movimientoCajaRepository: Repository<MovimientoCaja>,
  ) {}

  async abrirCaja(abrirCajaDto: AbrirCajaDto): Promise<Caja> {
    // Verificar que no hay otra caja abierta en la misma sede
    const cajaAbierta = await this.cajaRepository.findOne({
      where: {
        sedeId: abrirCajaDto.sedeId,
        estado: CajaEstado.ABIERTA,
      },
    });

    if (cajaAbierta) {
      throw new BadRequestException('Ya existe una caja abierta en esta sede');
    }

    const caja = this.cajaRepository.create({
      empresaId: abrirCajaDto.empresaId,
      sedeId: abrirCajaDto.sedeId,
      abiertoPor: abrirCajaDto.usuarioId,
      montoInicial: abrirCajaDto.montoInicial,
      estado: CajaEstado.ABIERTA,
      fechaApertura: new Date(),
    });

    const cajaNueva = await this.cajaRepository.save(caja);

    // Crear movimiento inicial
    await this.createMovimiento({
      tipo: MovimientoTipo.INGRESO,
      monto: abrirCajaDto.montoInicial,
      concepto: 'Apertura de caja',
      cajaId: cajaNueva.id,
      observaciones: 'Monto inicial de apertura',
    });

    return cajaNueva;
  }

  async cerrarCaja(cajaId: number, cerrarCajaDto: CerrarCajaDto): Promise<Caja> {
    const caja = await this.cajaRepository.findOne({
      where: { id: cajaId, estado: CajaEstado.ABIERTA },
    });

    if (!caja) {
      throw new NotFoundException('Caja no encontrada o ya está cerrada');
    }

    // Calcular el monto calculado basado en movimientos
    const montoCalculado = await this.calcularMontoCaja(cajaId);
    
    await this.cajaRepository.update(cajaId, {
      estado: CajaEstado.CERRADA,
      fechaCierre: new Date(),
      montoFinal: cerrarCajaDto.montoFinal,
      diferencia: cerrarCajaDto.montoFinal - montoCalculado,
    });

    return await this.cajaRepository.findOne({ where: { id: cajaId } });
  }

  async getCajaActiva(sedeId: number): Promise<Caja | null> {
    return await this.cajaRepository.findOne({
      where: { sedeId, estado: CajaEstado.ABIERTA },
      relations: ['movimientos'],
    });
  }

  async findAll(empresaId?: number, sedeId?: number, fechaInicio?: string, fechaFin?: string): Promise<Caja[]> {
    const queryBuilder = this.cajaRepository.createQueryBuilder('caja')
      .leftJoinAndSelect('caja.usuarioAbierto', 'usuarioAbierto')
      .leftJoinAndSelect('caja.usuarioCerrado', 'usuarioCerrado')
      .leftJoinAndSelect('caja.empresa', 'empresa')
      .leftJoinAndSelect('caja.sede', 'sede');

    if (empresaId) {
      queryBuilder.andWhere('caja.empresaId = :empresaId', { empresaId });
    }

    if (sedeId) {
      queryBuilder.andWhere('caja.sedeId = :sedeId', { sedeId });
    }

    if (fechaInicio && fechaFin) {
      queryBuilder.andWhere('caja.fechaApertura BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin + ' 23:59:59')
      });
    }

    return await queryBuilder
      .orderBy('caja.fechaApertura', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Caja> {
    const caja = await this.cajaRepository.findOne({
      where: { id },
      relations: ['usuarioAbierto', 'usuarioCerrado', 'empresa', 'sede', 'movimientos'],
    });

    if (!caja) {
      throw new NotFoundException('Caja no encontrada');
    }

    return caja;
  }

  async createMovimiento(createMovimientoDto: CreateMovimientoCajaDto): Promise<MovimientoCaja> {
    const caja = await this.cajaRepository.findOne({
      where: { id: createMovimientoDto.cajaId, estado: CajaEstado.ABIERTA },
    });

    if (!caja) {
      throw new NotFoundException('Caja no encontrada o está cerrada');
    }

    const movimiento = this.movimientoCajaRepository.create({
      ...createMovimientoDto,
      fecha: new Date(),
    });

    return await this.movimientoCajaRepository.save(movimiento);
  }

  async getMovimientosCaja(cajaId: number): Promise<MovimientoCaja[]> {
    return await this.movimientoCajaRepository.find({
      where: { cajaId },
      relations: ['pago', 'pago.socio', 'pago.socio.usuario'],
      order: { fecha: 'ASC' },
    });
  }

  private async calcularMontoCaja(cajaId: number): Promise<number> {
    const result = await this.movimientoCajaRepository
      .createQueryBuilder('movimiento')
      .select([
        'SUM(CASE WHEN movimiento.tipo = :ingreso THEN movimiento.monto ELSE 0 END) as ingresos',
        'SUM(CASE WHEN movimiento.tipo = :egreso THEN movimiento.monto ELSE 0 END) as egresos'
      ])
      .where('movimiento.cajaId = :cajaId', { cajaId })
      .setParameters({
        ingreso: MovimientoTipo.INGRESO,
        egreso: MovimientoTipo.EGRESO
      })
      .getRawOne();

    const ingresos = parseFloat(result.ingresos) || 0;
    const egresos = parseFloat(result.egresos) || 0;
    
    return ingresos - egresos;
  }

  async getResumenCaja(cajaId: number) {
    const caja = await this.findOne(cajaId);
    const movimientos = await this.getMovimientosCaja(cajaId);
    
    const resumen = {
      montoInicial: caja.montoInicial,
      totalIngresos: 0,
      totalEgresos: 0,
      montoCalculado: 0,
      montoFinal: caja.montoFinal,
      diferencia: caja.diferencia,
      cantidadMovimientos: movimientos.length,
    };

    movimientos.forEach(movimiento => {
      if (movimiento.tipo === MovimientoTipo.INGRESO) {
        resumen.totalIngresos += movimiento.monto;
      } else if (movimiento.tipo === MovimientoTipo.EGRESO) {
        resumen.totalEgresos += movimiento.monto;
      }
    });

    resumen.montoCalculado = resumen.totalIngresos - resumen.totalEgresos;

    return resumen;
  }
}