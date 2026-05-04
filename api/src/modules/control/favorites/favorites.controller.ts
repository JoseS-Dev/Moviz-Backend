import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    const result = await this.favoritesService.create(createFavoriteDto);
    return {
      success: true,
      message: 'Se ha creado un favorito exitosamente',
      data: result,
    };
  }

  @Get('user/:userId')
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.favoritesService.findAll(userId, page, limit);
    return {
      success: true,
      message: 'Se ha obtenido todos los favoritos del usuario exitosamente',
      data: result.favorites,
      meta: {
        page: page,
        limit: limit,
        total: result.total,
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    const result = await this.favoritesService.update(id, updateFavoriteDto);
    return {
      success: true,
      message: `Se ha actualizado el estado de favorito a ${updateFavoriteDto.is_favorite ? 'Activado' : 'Desactivado'}`,
      data: result,
    };
  }
}
