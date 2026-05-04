import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RoomService } from './room.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoomDto: CreateRoomDto) {
    const result = await this.roomService.create(createRoomDto);
    return {
      success: true,
      message: 'Se ha creado la sala exitosamente',
      data: result,
    };
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.roomService.findAll(page, limit);
    return {
      success: true,
      message: 'Se ha obtenidos las salas exitosamente',
      data: result.rooms,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.roomService.findOne(id);
    return {
      success: true,
      message: 'Se ha obtenido la información de la sala exitosamente',
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    const result = await this.roomService.update(id, updateRoomDto);
    return {
      success: true,
      message: 'Se ha actualidado la sala exitosamente',
      data: result,
    };
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    const result = await this.roomService.changeStatus(id, isActive);
    return {
      success: true,
      message: `se ha cambiado el estado de la sala ${isActive ? 'Activado' : 'Desactivado'}`,
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.roomService.remove(id);
    return {
      success: true,
      message: 'Se ha eliminado la sala exitosamente',
      data: result,
    };
  }
}
