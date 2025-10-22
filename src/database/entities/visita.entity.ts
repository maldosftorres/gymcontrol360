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
import { Dispositivo } from './dispositivo.entity';
import { VisitaMetodo, VisitaResultado } from '../../common/enums/sistema.enum';

@Entity('visitas')
@Index('idx_visitas_fecha', ['fechaIngreso'])
@Index('idx_visitas_metodo', ['metodoAcceso'])
@Index('idx_visitas_resultado', ['resultado'])
export class Visita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ name: 'socio_id' })
  socioId: number;

  @Column({ 
    name: 'metodo_acceso',
    type: 'enum', 
    enum: VisitaMetodo,
    default: VisitaMetodo.MANUAL 
  })
  metodoAcceso: VisitaMetodo;

  @Column({ name: 'dispositivo_id', nullable: true })
  dispositivoId: number;

  @Column({ 
    type: 'enum', 
    enum: VisitaResultado,
    default: VisitaResultado.PERMITIDO 
  })
  resultado: VisitaResultado;

  @Column({ name: 'motivo_denegacion', length: 255, nullable: true })
  motivoDenegacion: string;

  @Column({ name: 'fecha_ingreso', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaIngreso: Date;

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

  @ManyToOne(() => Dispositivo)
  @JoinColumn({ name: 'dispositivo_id' })
  dispositivo: Dispositivo;
}