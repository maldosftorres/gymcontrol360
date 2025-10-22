import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CajaService } from './caja.service';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { CreateMovimientoCajaDto } from './dto/create-movimiento-caja.dto';

@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Post('abrir')
  abrirCaja(@Body() abrirCajaDto: AbrirCajaDto) {
    return this.cajaService.abrirCaja(abrirCajaDto);
  }

  @Patch(':id/cerrar')
  cerrarCaja(
    @Param('id', ParseIntPipe) id: number,
    @Body() cerrarCajaDto: CerrarCajaDto,
  ) {
    return this.cajaService.cerrarCaja(id, cerrarCajaDto);
  }

  @Get('activa/:sedeId')
  getCajaActiva(@Param('sedeId', ParseIntPipe) sedeId: number) {
    return this.cajaService.getCajaActiva(sedeId);
  }

  @Get()
  findAll(
    @Query('empresaId') empresaId?: string,
    @Query('sedeId') sedeId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.cajaService.findAll(
      empresaId ? parseInt(empresaId) : undefined,
      sedeId ? parseInt(sedeId) : undefined,
      fechaInicio,
      fechaFin,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.findOne(id);
  }

  @Get(':id/resumen')
  getResumenCaja(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.getResumenCaja(id);
  }

  @Post('movimiento')
  createMovimiento(@Body() createMovimientoDto: CreateMovimientoCajaDto) {
    return this.cajaService.createMovimiento(createMovimientoDto);
  }

  @Get(':id/movimientos')
  getMovimientosCaja(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.getMovimientosCaja(id);
  }
}