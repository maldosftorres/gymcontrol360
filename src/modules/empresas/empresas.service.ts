import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../../database/entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private empresasRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const empresa = this.empresasRepository.create(createEmpresaDto);
    return await this.empresasRepository.save(empresa);
  }

  async findAll(): Promise<Empresa[]> {
    return await this.empresasRepository.find({
      where: { activa: true },
      relations: ['sedes'],
    });
  }

  async findOne(id: number): Promise<Empresa> {
    const empresa = await this.empresasRepository.findOne({
      where: { id, activa: true },
      relations: ['sedes'],
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return empresa;
  }

  async update(id: number, updateEmpresaDto: UpdateEmpresaDto): Promise<Empresa> {
    const empresa = await this.findOne(id);
    
    Object.assign(empresa, updateEmpresaDto);
    
    return await this.empresasRepository.save(empresa);
  }

  async remove(id: number): Promise<void> {
    const empresa = await this.findOne(id);
    empresa.activa = false;
    await this.empresasRepository.save(empresa);
  }

  async findByIds(ids: number[]): Promise<Empresa[]> {
    return await this.empresasRepository.findByIds(ids);
  }
}