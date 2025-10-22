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
import { MembresiaEstado } from '../../common/enums/membresia.enum';

@Entity('socios_membresias')
@Index('idx_sm_socio_fechas', ['socioId', 'fechaInicio', 'fechaFin'])
@Index('idx_sm_estado', ['estado'])
export class SocioMembresia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ name: 'socio_id' })
  socioId: number;

  @Column({ name: 'membresia_id' })
  membresiaId: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @Column({ 
    type: 'enum', 
    enum: MembresiaEstado,
    default: MembresiaEstado.ACTIVA 
  })
  estado: MembresiaEstado;

  @Column({ type: 'text', nullable: true })
  notas: string;

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

  @ManyToOne(() => Socio, (socio) => socio.membresias)
  @JoinColumn({ name: 'socio_id' })
  socio: Socio;

  @ManyToOne(() => Membresia, (membresia) => membresia.sociosMembresias)
  @JoinColumn({ name: 'membresia_id' })
  membresia: Membresia;
}