import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../../database/entities/usuario.entity';
import { Socio } from '../../database/entities/socio.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangeStatusUsuarioDto } from './dto/change-status-usuario.dto';
import { UsuarioRol, UsuarioEstado } from '../../common/enums/usuario.enum';
import { SocioEstado } from '../../common/enums/socio.enum';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Socio)
    private readonly socioRepository: Repository<Socio>,
    private readonly dataSource: DataSource,
  ) {}

  async login(loginDto: LoginDto) {
    const { documentoNumero, password } = loginDto;

    console.log('🔍 Intentando login con:', { documentoNumero, password: '***' });

    // Buscar usuario por número de documento
    const usuario = await this.usuarioRepository.findOne({
      where: { documentoNumero: documentoNumero },
      relations: ['empresa'],
    });

    console.log('👤 Usuario encontrado:', usuario ? { id: usuario.id, documentoNumero: usuario.documentoNumero, nombre: usuario.nombre } : 'No encontrado');

    if (!usuario) {
      console.log('❌ Usuario no encontrado para documento:', documentoNumero);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar password usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.passwordHash);
    console.log('🔐 Validación de password:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Password inválido para usuario:', documentoNumero);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token simple
    const accessToken = `token-${usuario.id}-${Date.now()}`;
    console.log('✅ Login exitoso, token generado:', accessToken);

    return {
      accessToken,
      user: {
        id: usuario.id,
        name: `${usuario.nombre} ${usuario.apellido}`,
        username: usuario.documentoNumero,
        empresa: usuario.empresa?.nombre,
      },
    };
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar que el email no exista
      const existingUser = await this.usuarioRepository.findOne({
        where: { email: createUsuarioDto.email }
      });

      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con este email');
      }

      // Verificar que el número de documento no exista
      const existingUserByDocument = await this.usuarioRepository.findOne({
        where: { documentoNumero: createUsuarioDto.documentoNumero }
      });

      if (existingUserByDocument) {
        throw new ConflictException('Ya existe un usuario con este número de documento');
      }

      // Validar sede según rol
      const rol = createUsuarioDto.rol || UsuarioRol.SOCIO;
      if (rol !== UsuarioRol.ADMINISTRADOR && !createUsuarioDto.sedeId) {
        throw new BadRequestException('Los usuarios que no son administradores deben tener una sede asignada');
      }

      // Encriptar la contraseña
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(createUsuarioDto.password, saltRounds);

      // Crear el usuario
      const usuario = this.usuarioRepository.create({
        ...createUsuarioDto,
        passwordHash,
        rol: createUsuarioDto.rol || UsuarioRol.SOCIO,
        estado: UsuarioEstado.ACTIVO,
        fechaAlta: new Date(),
        activo: true,
      });

      const usuarioGuardado = await queryRunner.manager.save(Usuario, usuario);

      // Si el rol es SOCIO, crear también el registro de socio
      if (usuario.rol === UsuarioRol.SOCIO) {
        // Generar código único para el socio
        const codigo = await this.generateSocioCodigo(createUsuarioDto.empresaId);

        const socio = this.socioRepository.create({
          empresaId: createUsuarioDto.empresaId,
          sedeId: createUsuarioDto.sedeId,
          usuarioId: usuarioGuardado.id,
          codigo,
          estado: SocioEstado.ACTIVO,
          fechaAlta: new Date(),
          entrenadorId: createUsuarioDto.entrenadorId,
          totalVisitas: 0,
          rfidCodigo: createUsuarioDto.rfidCodigo,
          notas: createUsuarioDto.notas,
        });

        await queryRunner.manager.save(Socio, socio);
      }

      await queryRunner.commitTransaction();

      // Retornar el usuario creado con sus relaciones
      return await this.usuarioRepository.findOne({
        where: { id: usuarioGuardado.id },
        relations: ['empresa', 'sede', 'socios'],
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(empresaId?: number, sedeId?: number) {
    const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.empresa', 'empresa')
      .leftJoinAndSelect('usuario.sede', 'sede')
      .leftJoinAndSelect('usuario.socios', 'socios')
      .where('usuario.activo = :activo', { activo: true });

    if (empresaId) {
      queryBuilder.andWhere('usuario.empresaId = :empresaId', { empresaId });
    }

    if (sedeId) {
      queryBuilder.andWhere('usuario.sedeId = :sedeId', { sedeId });
    }

    return await queryBuilder
      .orderBy('usuario.nombre', 'ASC')
      .addOrderBy('usuario.apellido', 'ASC')
      .getMany();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id, activo: true },
      relations: ['empresa', 'sede', 'socios'],
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);

    // Si se está actualizando el email, verificar que no exista
    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email }
      });

      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con este email');
      }
    }

    // Si se está actualizando el número de documento, verificar que no exista
    if (updateUsuarioDto.documentoNumero && updateUsuarioDto.documentoNumero !== usuario.documentoNumero) {
      const existingUserByDocument = await this.usuarioRepository.findOne({
        where: { documentoNumero: updateUsuarioDto.documentoNumero }
      });

      if (existingUserByDocument) {
        throw new ConflictException('Ya existe un usuario con este número de documento');
      }
    }

    // Si se está actualizando la contraseña, encriptarla
    let updateData: any = { ...updateUsuarioDto };
    if (updateUsuarioDto.password) {
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(updateUsuarioDto.password, saltRounds);
      delete updateData.password;
    }

    await this.usuarioRepository.update(id, updateData);

    return await this.findOne(id);
  }

  async changeStatus(id: number, changeStatusDto: ChangeStatusUsuarioDto) {
    const usuario = await this.findOne(id);
    const { estado, motivo } = changeStatusDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Actualizar el estado del usuario
      const updateData: any = {
        estado,
      };

      // Si se está suspendiendo o inactivando, agregar fecha de baja
      if (estado === UsuarioEstado.INACTIVO || estado === UsuarioEstado.SUSPENDIDO) {
        updateData.fechaBaja = new Date();
        updateData.activo = false;
        updateData.motivoBaja = motivo;
      } else if (estado === UsuarioEstado.ACTIVO) {
        // Si se está activando, limpiar fecha de baja y activar
        updateData.fechaBaja = null;
        updateData.activo = true;
        updateData.motivoBaja = null;
      }

      await queryRunner.manager.update(Usuario, id, updateData);

      // Si el usuario es socio, también actualizar el estado del socio
      if (usuario.rol === UsuarioRol.SOCIO) {
        const socioEstado = estado === UsuarioEstado.ACTIVO ? SocioEstado.ACTIVO : 
                           estado === UsuarioEstado.SUSPENDIDO ? SocioEstado.SUSPENDIDO : 
                           SocioEstado.INACTIVO;

        await queryRunner.manager.update(Socio, 
          { usuarioId: id }, 
          { 
            estado: socioEstado,
            ...(estado !== UsuarioEstado.ACTIVO && { fechaBaja: new Date() })
          }
        );
      }

      await queryRunner.commitTransaction();

      return await this.findOne(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);

    // Soft delete - marcar como inactivo
    await this.usuarioRepository.update(id, { 
      activo: false,
      fechaBaja: new Date(),
      estado: UsuarioEstado.INACTIVO
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  private async generateSocioCodigo(empresaId: number): Promise<string> {
    // Obtener el último código generado para esta empresa
    const lastSocio = await this.socioRepository
      .createQueryBuilder('socio')
      .where('socio.empresaId = :empresaId', { empresaId })
      .orderBy('socio.id', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastSocio && lastSocio.codigo) {
      // Extraer el número del código (asumiendo formato como SOC-001, SOC-002, etc.)
      const match = lastSocio.codigo.match(/(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Generar código con formato SOC-XXX (padded con zeros)
    return `SOC-${nextNumber.toString().padStart(3, '0')}`;
  }
}