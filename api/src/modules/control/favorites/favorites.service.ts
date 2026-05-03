import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';
import { PrismaService } from '../../../prisma.service.js'

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(createFavoriteDto: CreateFavoriteDto) {
    if(!createFavoriteDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista el usuario y la pelicual en cuestión
    const [existingUser, existingFootage] = await Promise.all([
      this.prisma.users.findUnique({
        where: {id: createFavoriteDto.user_id}
      }),
      this.prisma.footage.findUnique({
        where: {id: createFavoriteDto.movie_id}
      })
    ]);
    if(!existingUser) throw new NotFoundException('El usuario en cuestión no existen');
    if(!existingFootage) throw new NotFoundException('La pelicula en cuestión no existen');
    // Si todo esta bien se crea el favorito
    const newFavorite = await this.prisma.favoriteMovies.create({
      data: createFavoriteDto
    });
    if(!newFavorite) throw new BadRequestException('No se pudo crear el favorito entre el usuario y la pelicula');
    return newFavorite
  }

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    if(!userId) throw new BadRequestException('El ID del usuario no fue propocionado');
    // Se verifica que exista el usuario
    const existingUser = await this.prisma.users.findUnique({
      where: {id: userId}
    });
    if(!existingUser) throw new NotFoundException('No se encontro el usuario en cuestión');
    // Si existe se obtiene los favoritos
    const skip = (page - 1) * limit;
    // Se cuenta los favoritos que tiene el usuario
    const totalFavorites = await this.prisma.favoriteMovies.count({
      where: {user_id: userId, is_favorite: true}
    });
    const favorites = await this.prisma.favoriteMovies.findMany({
      skip: skip,
      take: limit
    });
    return {favorites, total: totalFavorites}
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    if(!id) throw new BadRequestException('El ID del favorito a actualizar no se propociono');
    if(!updateFavoriteDto) throw new BadRequestException('Los datos a actuaizar no se propocionado');
    // Se verifica que existe el favorito
    const existingFavorite = await this.prisma.favoriteMovies.findUnique({
      where: {id}
    });
    if(!existingFavorite) throw new NotFoundException('No existe el favorito a actualizar');
    // Se procede a actualizar
    const updatedFavorite = await this.prisma.favoriteMovies.update({
      where: {id},
      data: {
        is_favorite: updateFavoriteDto.is_favorite
      }
    });
    if(!updatedFavorite) throw new BadRequestException('No se pudo actualizar el favorito')
    return updatedFavorite
  }

}
