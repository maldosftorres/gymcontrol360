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
import { Caja } from './caja.entity';
import { MovimientoTipo } from '../../common/enums/sistema.enum';

@Entity('movimientos_caja')
@Index('idx_movcaja_fecha', ['fecha'])
@Index('idx_movcaja_tipo', ['tipo'])
export class MovimientoCaja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ name: 'caja_id' })
  cajaId: number;

  @Column({ 
    type: 'enum', 
    enum: MovimientoTipo,
    default: MovimientoTipo.INGRESO 
  })
  tipo: MovimientoTipo;

  @Column({ length: 100, nullable: true })
  categoria: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

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

  @ManyToOne(() => Caja, (caja) => caja.movimientos)
  @JoinColumn({ name: 'caja_id' })
  caja: Caja;
}