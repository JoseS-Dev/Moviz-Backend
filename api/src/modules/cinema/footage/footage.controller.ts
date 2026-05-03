import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import type {Request, Response} from 'express';
import { FootageService } from './footage.service.js';
import { CreateFootageDto } from './dto/create-footage.dto.js';
import { UpdateFootageDto } from './dto/update-footage.dto.js';

@Controller('footage')
export class FootageController {
  constructor(private readonly footageService: FootageService) {}

  @Post()
  async create(
    @Body() createFootageDto: CreateFootageDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.footageService.create(createFootageDto);
    return res.status(201).json({
      success: true,
      message: 'Se ha creado la pelicula exitosamente',
      data: result
    })
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.footageService.findAll(page, limit);
    return res.status(200).json({
      success: true,
      message: 'Peliculas obtenidas exitosamente',
      data: result.footages,
      meta: {
        page: page,
        limit: limit,
        total: result.total,
      }
    })
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.footageService.findOne(id);
    return res.status(200).json({
      success: true,
      message: 'Pelicula obtenida exitosamente',
      data: result
    })
  }

  @Patch(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateFootageDto: UpdateFootageDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.footageService.update(id, updateFootageDto);
    return res.status(200).json({
      success: true,
      message: 'Pelicula actualizada exitosamente',
      data: result
    })
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: number,
    @Body('isActive') isActive: boolean,
    @Req() req: Request,
    @Res() res: Response
  ){
    const result = await this.footageService.changeStatus(id, isActive);
    return res.status(200).json({
      success: true,
      message: `se ha cambiado el estado de la pelicula ${isActive ? 'Activado' : 'Desactivado'}`,
      data: result
    })
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.footageService.remove(id);
    return res.status(200).json({
      success: true,
      message: 'Pelicula elimina exitosamente',
      data: result
    })
  }
}
