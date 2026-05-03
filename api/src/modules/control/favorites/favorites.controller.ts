import { Controller, Get, Post, Body, Patch, Param, Req, Res, Query } from '@nestjs/common';
import type {Request, Response} from 'express';
import { FavoritesService } from './favorites.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.favoritesService.create(createFavoriteDto);
      return res.status(201).json({
        success: true,
        message: 'Se ha creado un favorito exitosamente',
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

  @Get(':userId')
  async findAll(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.favoritesService.findAll(userId, page, limit);
      return res.status(200).json({
        success: true,
        message: 'Se ha obtenido todos los favoritos del usuario exitosamente',
        data: result.favorites,
        meta: {
          page: page,
          limit: limit,
          total: result.total
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

  @Patch(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try{
      const result = await this.favoritesService.update(id, updateFavoriteDto);
      return res.status(200).json({
        success: true,
        message: `Se ha actualizado el estado de favorito a ${updateFavoriteDto.is_favorite ? 'Activado' : 'Desactivado'}`,
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

}
