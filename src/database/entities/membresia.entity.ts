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
import { SocioMembresia } from './socio-membresia.entity';

@Entity('membresias')
@Index('idx_membresias_empresa_sede', ['empresaId', 'sedeId'])
@Index('idx_membresias_activa', ['activa'])
export class Membresia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @Column({ name: 'duracion_dias' })
  duracionDias: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ default: true })
  activa: boolean;

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

  @OneToMany(() => SocioMembresia, (sm) => sm.membresia)
  sociosMembresias: SocioMembresia[];
}