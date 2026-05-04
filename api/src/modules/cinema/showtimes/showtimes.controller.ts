import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service.js';
import { CreateShowtimeDto } from './dto/create-showtime.dto.js';
import { UpdateShowtimeDto } from './dto/update-showtime.dto.js';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createShowtimeDto: CreateShowtimeDto) {
    const result = await this.showtimesService.create(createShowtimeDto);
    return {
      success: true,
      message: 'La función ha sido creada exitosamente',
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.showtimesService.findAll(page, limit);
    return {
      success: true,
      message: 'Las funciones se han obtenido exitosamente',
      data: result.showtimes,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
      },
    };
  }

  @Get('room/:id')
  @HttpCode(HttpStatus.OK)
  async findAllByRoom(
    @Param('id', ParseIntPipe) roomId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.showtimesService.findAllByRoom(
      roomId,
      page,
      limit,
    );
    return {
      success: true,
      message: 'Las funciones se han obtenido exitosamente',
      data: result.showtimes,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.showtimesService.findOne(id);
    return {
      success: true,
      message: 'La función ha sido obtenida exitosamente',
      data: result,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    const result = await this.showtimesService.update(id, updateShowtimeDto);
    return {
      success: true,
      message: 'La función ha sido actualizada exitosamente',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.showtimesService.remove(id);
    return {
      success: true,
      message: 'La función ha sido eliminada exitosamente',
      data: result,
    };
  }
}
