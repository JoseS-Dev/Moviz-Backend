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
  Query
} from '@nestjs/common';
import { FootageService } from './footage.service.js';
import { CreateFootageDto } from './dto/create-footage.dto.js';
import { UpdateFootageDto } from './dto/update-footage.dto.js';

@Controller('footage')
export class FootageController {
  constructor(private readonly footageService: FootageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createFootageDto: CreateFootageDto,
  ) {
    const result = await this.footageService.create(createFootageDto);
    return {
      success: true,
      message: 'Se ha creado la pelicula exitosamente',
      data: result
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.footageService.findAll(page, limit);
    return {
      success: true,
      message: 'Peliculas obtenidas exitosamente',
      data: result.footages,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
      }
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.footageService.findOne(id);
    return {
      success: true,
      message: 'Pelicula obtenida exitosamente',
      data: result
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateFootageDto: UpdateFootageDto,
  ) {
    const result = await this.footageService.update(id, updateFootageDto);
    return {
      success: true,
      message: 'Pelicula actualizada exitosamente',
      data: result
    }
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ){
    const result = await this.footageService.changeStatus(id, isActive);
    return {
      success: true,
      message: `se ha cambiado el estado de la pelicula ${isActive ? 'Activado' : 'Desactivado'}`,
      data: result
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.footageService.remove(id);
    return {
      success: true,
      message: 'Pelicula elimina exitosamente',
      data: result
    }
  }
}
