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
import { SocioMembresia } from './socio-membresia.entity';
import { SocioEstado } from '../../common/enums/socio.enum';

@Entity('socios')
@Index('idx_socios_estado', ['estado'])
@Index('idx_socios_entrenador', ['entrenadorId'])
export class Socio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ length: 20 })
  codigo: string;

  @Column({ 
    type: 'enum', 
    enum: SocioEstado,
    default: SocioEstado.ACTIVO 
  })
  estado: SocioEstado;

  @Column({ name: 'fecha_alta', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaAlta: Date;

  @Column({ name: 'fecha_baja', type: 'datetime', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'entrenador_id', nullable: true })
  entrenadorId: number;

  @Column({ name: 'ultimo_checkin_en', type: 'datetime', nullable: true })
  ultimoCheckinEn: Date;

  @Column({ name: 'total_visitas', default: 0 })
  totalVisitas: number;

  @Column({ name: 'rfid_codigo', length: 64, nullable: true })
  rfidCodigo: string;

  @Column({ name: 'preferencia_horaria_json', type: 'json', nullable: true })
  preferenciaHorariaJson: any;

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

  @ManyToOne(() => Usuario, (usuario) => usuario.socios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'entrenador_id' })
  entrenador: Usuario;

  @OneToMany(() => SocioMembresia, (sm) => sm.socio)
  membresias: SocioMembresia[];
}