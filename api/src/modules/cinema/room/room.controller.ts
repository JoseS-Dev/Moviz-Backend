import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import type { Response, Request } from 'express';
import { RoomService } from './room.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.roomService.create(createRoomDto);
      return res.status(201).json({
        success: true,
        message: 'Se ha creado la sala exitosamente',
        data: result
      });
    }
    catch(error){
      return res.status(500).json({
        success: false,
        message: 'Error Interno del Servidor',
        details: error
      })
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.roomService.findAll(page, limit);
      return res.status(200).json({
        success: true,
        message: 'Se ha obtenidos las salas exitosamente',
        data: result.rooms,
        meta: {
          page: page,
          limit: limit,
          total: result.total,
        }
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

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.roomService.findOne(id);
      return res.status(200).json({
        success: true,
        message: 'Se ha obtenido la información de la sala exitosamente',
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

  @Patch(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateRoomDto: UpdateRoomDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.roomService.update(id, updateRoomDto)
      return res.status(200).json({
        success: true,
        message: 'Se ha actualidado la sala exitosamente',
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

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: number,
    @Body('isActive') isActive: boolean,
    @Req() req: Request,
    @Res() res: Response
  ){
    try{
      const result = await this.roomService.changeStatus(id, isActive);
      return res.status(200).json({
        success: true,
        message: `se ha cambiado el estado de la sala ${isActive ? 'Activado' : 'Desactivado'}`,
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

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.roomService.remove(id);
      return res.status(200).json({
        success: true,
        message: 'Se ha eliminado la sala exitosamente',
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
