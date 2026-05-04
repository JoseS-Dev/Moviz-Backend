import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SeatsService } from './seats.service.js';
import { CreateSeatDto } from './dto/create-seat.dto.js';
import { UpdateSeatDto } from './dto/update-seat.dto.js';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSeatDto: CreateSeatDto) {
    const result = await this.seatsService.create(createSeatDto);
    return {
      success: true,
      message: 'Se ha creado la silla exitosamente',
      data: result,
    };
  }

  @Get('room/:roomId')
  async findAll(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.seatsService.findAll(roomId, page, limit);
    return {
      success: true,
      message: 'Sillas de una sala obtenida exitosamente',
      data: result.seats,
      meta: {
        page: page,
        limit: limit,
        total: result.total,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.seatsService.findOne(id);
    return {
      success: true,
      message: 'Se ha obtenido la silla exitosamente',
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeatDto: UpdateSeatDto,
  ) {
    const result = await this.seatsService.update(id, updateSeatDto);
    return {
      success: true,
      message: 'Se ha actualizado la información de la silla exitosamente',
      data: result,
    };
  }

  @Patch(':id/status')
  async changeStatusAvailable(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    const result = await this.seatsService.changeStatusAvailable(id, isActive);
    return {
      success: true,
      message: `Se ha cambiado el estado de la silla ha ${isActive ? 'Disponible' : 'Ocupado'}`,
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.seatsService.remove(id);
    return {
      success: true,
      message: 'Se ha eliminado la silla exitosamente',
      data: result,
    };
  }
}
