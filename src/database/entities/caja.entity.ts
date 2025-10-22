import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from './empresa.entity';
import { Sede } from './sede.entity';
import { Usuario } from './usuario.entity';
import { MovimientoCaja } from './movimiento-caja.entity';
import { CajaEstado } from '../../common/enums/sistema.enum';

@Entity('caja')
@Index('idx_caja_estado', ['empresaId', 'sedeId', 'estado'])
export class Caja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ name: 'abierto_por', nullable: true })
  abiertoPor: number;

  @Column({ name: 'cerrado_por', nullable: true })
  cerradoPor: number;

  @Column({ name: 'fecha_apertura', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaApertura: Date;

  @Column({ name: 'fecha_cierre', type: 'datetime', nullable: true })
  fechaCierre: Date;

  @Column({ name: 'monto_inicial', type: 'decimal', precision: 10, scale: 2, default: 0 })
  montoInicial: number;

  @Column({ name: 'monto_final', type: 'decimal', precision: 10, scale: 2, default: 0 })
  montoFinal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  diferencia: number;

  @Column({ 
    type: 'enum', 
    enum: CajaEstado,
    default: CajaEstado.ABIERTA 
  })
  estado: CajaEstado;

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

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'abierto_por' })
  usuarioAbierto: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'cerrado_por' })
  usuarioCerrado: Usuario;

  @OneToMany(() => MovimientoCaja, (movimiento) => movimiento.caja)
  movimientos: MovimientoCaja[];
}