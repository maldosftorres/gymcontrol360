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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangeStatusUsuarioDto } from './dto/change-status-usuario.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll(
    @Query('empresaId') empresaId?: string,
    @Query('sedeId') sedeId?: string,
  ) {
    const empresaIdNum = empresaId ? parseInt(empresaId) : undefined;
    const sedeIdNum = sedeId ? parseInt(sedeId) : undefined;
    return this.usuariosService.findAll(empresaIdNum, sedeIdNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @ApiOperation({
    summary: 'Cambiar estado de un usuario',
    description: 'Permite cambiar el estado de un usuario (ACTIVO, INACTIVO, SUSPENDIDO). Si el usuario es un socio, también se actualiza su estado correspondiente.'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: ChangeStatusUsuarioDto })
  @ApiResponse({ status: 200, description: 'Estado cambiado exitosamente' })
  @ApiResponse({ status: 400, description: 'Usuario no encontrado' })
  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusUsuarioDto,
  ) {
    return this.usuariosService.changeStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}