import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from './empresa.entity';
import { Sede } from './sede.entity';
import { Socio } from './socio.entity';
import { Membresia } from './membresia.entity';
import { MetodoPago } from '../../common/enums/sistema.enum';

@Entity('pagos')
@Index('idx_pagos_fecha', ['fechaPago'])
@Index('idx_pagos_metodo', ['metodoPago'])
@Index('idx_pagos_socio', ['socioId'])
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ name: 'socio_id' })
  socioId: number;

  @Column({ name: 'membresia_id', nullable: true })
  membresiaId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ 
    name: 'metodo_pago',
    type: 'enum', 
    enum: MetodoPago,
    default: MetodoPago.EFECTIVO 
  })
  metodoPago: MetodoPago;

  @Column({ name: 'es_parcial', default: false })
  esParcial: boolean;

  @Column({ length: 100, nullable: true })
  referencia: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'fecha_pago', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaPago: Date;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  // Relaciones
  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => Sede)
  @JoinColumn({ name: 'sede_id' })
  sede: Sede;

  @ManyToOne(() => Socio)
  @JoinColumn({ name: 'socio_id' })
  socio: Socio;

  @ManyToOne(() => Membresia)
  @JoinColumn({ name: 'membresia_id' })
  membresia: Membresia;
}