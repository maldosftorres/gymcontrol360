import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@ApiTags('pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo pago' })
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los pagos' })
  findAll(
    @Query('empresaId', ParseIntPipe) empresaId: number,
    @Query('sedeId') sedeId?: number,
  ) {
    return this.pagosService.findAll(empresaId, sedeId);
  }

  @Get('hoy')
  @ApiOperation({ summary: 'Obtener total de pagos de hoy' })
  getTotalPagosHoy(@Query('empresaId', ParseIntPipe) empresaId: number) {
    return this.pagosService.getTotalPagosHoy(empresaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pago por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar pago' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePagoDto: UpdatePagoDto,
  ) {
    return this.pagosService.update(id, updatePagoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar pago' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.remove(id);
  }
}
