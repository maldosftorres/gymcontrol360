import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto, UpdateSedeDto } from './dto';

@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post()
  create(@Query('empresaId', ParseIntPipe) empresaId: number, @Body() createSedeDto: CreateSedeDto) {
    return this.sedesService.create(empresaId, createSedeDto);
  }

  @Get()
  findAll(@Query('empresaId', ParseIntPipe) empresaId: number) {
    return this.sedesService.findAll(empresaId);
  }

  @Get('activas')
  findAllActivas(@Query('empresaId', ParseIntPipe) empresaId: number) {
    return this.sedesService.findAllActivas(empresaId);
  }

  @Get(':id')
  findOne(@Query('empresaId', ParseIntPipe) empresaId: number, @Param('id', ParseIntPipe) id: number) {
    return this.sedesService.findOne(empresaId, id);
  }

  @Get(':id/stats')
  getStats(@Query('empresaId', ParseIntPipe) empresaId: number, @Param('id', ParseIntPipe) id: number) {
    return this.sedesService.getStats(empresaId, id);
  }

  @Patch(':id')
  update(
    @Query('empresaId', ParseIntPipe) empresaId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSedeDto: UpdateSedeDto,
  ) {
    return this.sedesService.update(empresaId, id, updateSedeDto);
  }

  @Patch(':id/toggle-activa')
  toggleActiva(@Query('empresaId', ParseIntPipe) empresaId: number, @Param('id', ParseIntPipe) id: number) {
    return this.sedesService.toggleActiva(empresaId, id);
  }

  @Delete(':id')
  remove(@Query('empresaId', ParseIntPipe) empresaId: number, @Param('id', ParseIntPipe) id: number) {
    return this.sedesService.remove(empresaId, id);
  }
}