import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MembresiasService } from './membresias.service';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';
import { AsignarMembresiaDto, UpdateSocioMembresiaDto } from './dto/asignar-membresia.dto';

@Controller('membresias')
export class MembresiasController {
  constructor(private readonly membresiasService: MembresiasService) {}

  // CRUD de Membresías
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMembresiaDto: CreateMembresiaDto) {
    return this.membresiasService.create(createMembresiaDto);
  }

  @Get()
  findAll(
    @Query('empresaId') empresaId?: string,
    @Query('sedeId') sedeId?: string,
  ) {
    const empresaIdNum = empresaId ? parseInt(empresaId) : undefined;
    const sedeIdNum = sedeId ? parseInt(sedeId) : undefined;
    return this.membresiasService.findAll(empresaIdNum, sedeIdNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMembresiaDto: UpdateMembresiaDto,
  ) {
    return this.membresiasService.update(id, updateMembresiaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.remove(id);
  }

  // Asignación de membresías
  @Post('asignar')
  @HttpCode(HttpStatus.CREATED)
  asignarMembresia(@Body() asignarMembresiaDto: AsignarMembresiaDto) {
    return this.membresiasService.asignarMembresia(asignarMembresiaDto);
  }

  @Get('socio/:socioId')
  findMembresiasSocio(@Param('socioId', ParseIntPipe) socioId: number) {
    return this.membresiasService.findMembresiasSocio(socioId);
  }

  @Get('socio/:socioId/activa')
  findMembresiaActivaSocio(@Param('socioId', ParseIntPipe) socioId: number) {
    return this.membresiasService.findMembresiaActivaSocio(socioId);
  }

  @Patch('asignacion/:id')
  updateSocioMembresia(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSocioMembresiaDto,
  ) {
    return this.membresiasService.updateSocioMembresia(id, updateDto);
  }

  // Reportes y utilidades
  @Get('reportes/por-vencer')
  getMembresiasPorVencer(
    @Query('dias') dias?: string,
    @Query('empresaId') empresaId?: string,
  ) {
    const diasNum = dias ? parseInt(dias) : 7;
    const empresaIdNum = empresaId ? parseInt(empresaId) : undefined;
    return this.membresiasService.getMembresiasPorVencer(diasNum, empresaIdNum);
  }

  @Patch('utilidades/actualizar-vencidas')
  actualizarEstadosVencidos() {
    return this.membresiasService.actualizarEstadosVencidos();
  }
}