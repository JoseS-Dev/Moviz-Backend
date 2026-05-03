import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SeatsService } from './seats.service.js';
import { CreateSeatDto } from './dto/create-seat.dto.js';
import { UpdateSeatDto } from './dto/update-seat.dto.js';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  async create(
    @Body() createSeatDto: CreateSeatDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.seatsService.create(createSeatDto);
      return res.status(201).json({
        success: true,
        message: 'Se ha creado la silla exitosamente',
        data: result
      })
    }
    catch(error){
      return res.status(500).json({
        success: false,
        message: 'Error Interno del Servidor',
        details: error
      })
    }
  }

  @Get(':roomId')
  async findAll(
    @Param('roomId') roomId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.seatsService.findAll(roomId, page, limit);
      return res.status(200).json({
        success: true,
        message: 'Sillas de una sala obtenida exitosamente',
        data: result.seats,
        meta: {
          page: page,
          limit: limit,
          total: result.total
        }
      })
    }
    catch(error){
      return res.status(500).json({
        success: true,
        message: 'Error Interno del Servidor',
        details: error
      })
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.seatsService.findOne(id);
      return res.status(200).json({
        success: true,
        message: 'Se ha obtenido la silla exitosamente',
        data: result
      })
    }
    catch(error){
      return res.status(500).json({
        success: true,
        message: 'Error Interno del Servidor',
        details: error
      })
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateSeatDto: UpdateSeatDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.seatsService.update(id, updateSeatDto);
      return res.status(200).json({
        success: true,
        message: 'Se ha actualizado la información de la silla exitosamente',
        data: result
      })
    }
    catch(error){
      return res.status(500).json({
        success: true,
        message: 'Error Interno del Servidor',
        details: error
      })
    }
  }

  @Patch(':id/status')
  async changeStatusAvailable(
    @Param(':id') id: number,
    @Body('isActive') isActive: boolean,
    @Req() req: Request,
    @Res() res: Response
  ){
    try{
      const result = await this.seatsService.changeStatusAvailable(id, isActive);
      return res.status(200).json({
        success: true,
        message: `Se ha cambiado el estado de la silla ha ${isActive ? 'Disponible' : 'Ocupado'}`,
        data: result
      })
    }
    catch(error){
      return res.status(500).json({
        success: true,
        message: 'Error Interno del Servidor',
        details: error
      })
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.seatsService.remove(id);
      return res.status(200).json({
        success: true,
        message: 'Se ha eliminado la silla exitosamente',
        data: result
      })
    }
    catch(error){
      return res.status(500).json({
        success: true,
        message: 'Error Interno del Servidor',
        details: error
      })
    }
  }
}
