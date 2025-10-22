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
import { DispositivoTipo, DispositivoEstado } from '../../common/enums/sistema.enum';

@Entity('dispositivos')
@Index('idx_disp_empresa_sede', ['empresaId', 'sedeId'])
@Index('idx_disp_tipo_estado', ['tipo', 'estado'])
export class Dispositivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number;

  @Column({ 
    type: 'enum', 
    enum: DispositivoTipo 
  })
  tipo: DispositivoTipo;

  @Column({ length: 100, nullable: true })
  nombre: string;

  @Column({ length: 100, nullable: true })
  ubicacion: string;

  @Column({ name: 'configuracion_json', type: 'json', nullable: true })
  configuracionJson: any;

  @Column({ 
    type: 'enum', 
    enum: DispositivoEstado,
    default: DispositivoEstado.DESCONECTADO 
  })
  estado: DispositivoEstado;

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
}