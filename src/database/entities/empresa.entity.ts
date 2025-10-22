import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Sede } from './sede.entity';
import { Usuario } from './usuario.entity';

@Entity('empresas')
@Index('idx_empresas_activa', ['activa'])
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ name: 'razon_social', length: 200, nullable: true })
  razonSocial: string;

  @Column({ length: 30, nullable: true })
  ruc: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ name: 'logo_url', length: 255, nullable: true })
  logoUrl: string;

  @Column({ default: true })
  activa: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  // Relaciones
  @OneToMany(() => Sede, (sede) => sede.empresa)
  sedes: Sede[];

  @OneToMany(() => Usuario, (usuario) => usuario.empresa)
  usuarios: Usuario[];
}