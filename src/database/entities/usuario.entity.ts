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
import { Socio } from './socio.entity';
import { DocumentoTipo, Genero, UsuarioRol, UsuarioEstado } from '../../common/enums/usuario.enum';

@Entity('usuarios')
@Index('idx_usuarios_empresa_sede', ['empresaId', 'sedeId'])
@Index('idx_usuarios_rol', ['rol'])
@Index('idx_usuarios_estado', ['estado'])
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @Column({ name: 'sede_id', nullable: true })
  sedeId: number | null;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ 
    name: 'documento_tipo',
    type: 'enum', 
    enum: DocumentoTipo,
    default: DocumentoTipo.CI 
  })
  documentoTipo: DocumentoTipo;

  @Column({ name: 'documento_numero', length: 50, nullable: true })
  documentoNumero: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ 
    type: 'enum', 
    enum: Genero,
    default: Genero.OTRO 
  })
  genero: Genero;

  @Column({ name: 'foto_url', length: 255, nullable: true })
  fotoUrl: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ 
    type: 'enum', 
    enum: UsuarioRol,
    default: UsuarioRol.SOCIO 
  })
  rol: UsuarioRol;

  @Column({ 
    type: 'enum', 
    enum: UsuarioEstado,
    default: UsuarioEstado.ACTIVO 
  })
  estado: UsuarioEstado;

  @Column({ name: 'fecha_alta', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaAlta: Date;

  @Column({ name: 'fecha_baja', type: 'datetime', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'motivo_baja', type: 'text', nullable: true })
  motivoBaja: string;

  @Column({ name: 'ultimo_acceso', type: 'datetime', nullable: true })
  ultimoAcceso: Date;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  // Relaciones
  @ManyToOne(() => Empresa, (empresa) => empresa.usuarios)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ManyToOne(() => Sede, (sede) => sede.usuarios, { nullable: true })
  @JoinColumn({ name: 'sede_id' })
  sede: Sede | null;

  @OneToMany(() => Socio, (socio) => socio.usuario)
  socios: Socio[];
}