import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Review } from './entities/review.entity.js';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}
  
  async create(createReviewDto: CreateReviewDto) : Promise<Review> {
    if(!createReviewDto) throw new BadRequestException('Los datos no fueron proporcionados');
    // Se verifica que exista la pelicula y el usuario
    const [existingFootage, existingUser] = await Promise.all([
      this.prisma.footage.findUnique({
        where: {id: createReviewDto.movie_id}
      }),
      this.prisma.users.findUnique({
        where: {id: createReviewDto.user_id}
      })
    ]);
    if(!existingFootage) throw new NotFoundException('La pelicula no existe');
    if(!existingUser) throw new NotFoundException('El usuario no existe');
    // Si todo esta bien, se crea la reseña
    const review = await this.prisma.reviews.create({
      data: createReviewDto,
      include: {
        users: true,
        footage: true
      }
    });
    if(!review) throw new BadRequestException('La reseña no pudo ser creada');
    return review;
  }

  async findAll(page: number = 1, limit: number = 10) : Promise<{reviews: Review[], total: number}> {
    const skip = (page - 1) * limit;
    // Se cuenta el total de registros
    const total = await this.prisma.reviews.count();
    const reviews = await this.prisma.reviews.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        users: true,
        footage: true
      }
    });
    return {reviews, total};
  }

  async findAllByUser(userId: number, page: number = 1, limit: number = 10) : Promise<{reviews: Review[], total: number}> {
    const skip = (page - 1) * limit;
    // Se cuenta el total de reseñas realziadas por el usuario
    const total = await this.prisma.reviews.count({where: {user_id: userId}});
    const reviews = await this.prisma.reviews.findMany({
      where: {user_id: userId},
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        users: true,
        footage: true
      }
    });
    return {reviews, total};
  }

  async findAllByFootage(footageId: number, page: number = 1, limit: number = 10) : Promise<{reviews: Review[], total: number}> {
    const skip = (page - 1) * limit;
    // Se cuenta el total de reseñas realizadas por la pelicula
    const total = await this.prisma.reviews.count({where: {movie_id: footageId}});
    const reviews = await this.prisma.reviews.findMany({
      where: {movie_id: footageId},
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        users: true,
        footage: true
      }
    });
    return {reviews, total};
  }

  async findOne(id: number) : Promise<Review> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    const review = await this.prisma.reviews.findUnique({
      where: {id},
      include: {
        users: true,
        footage: true
      }
    });
    if(!review) throw new NotFoundException('La reseña no existe');
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) : Promise<Partial<Review>> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la reseña
    const existingReview = await this.findOne(id);
    if(!existingReview) throw new NotFoundException('La reseña no existe');
    // Se actualiza la reseña correspondiente
    const updatedReview = await this.prisma.reviews.update({
      where: {id},
      data: updateReviewDto,
      include: {
        users: true,
        footage: true
      }
    });
    if(!updatedReview) throw new BadRequestException('La reseña no pudo ser actualizada');
    return updatedReview;
  }

  async changeStatus(id: number, isActive: boolean) : Promise<Partial<Review>> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la reseña
    const existingReview = await this.findOne(id);
    if(!existingReview) throw new NotFoundException('La reseña no existe');
    // Se actualiza la reseña correspondiente
    const updatedReview = await this.prisma.reviews.update({
      where: {id},
      data: {
        is_active: isActive
      },
      include: {
        users: true,
        footage: true
      }
    });
    if(!updatedReview) throw new BadRequestException('La reseña no pudo ser actualizada');
    return updatedReview;
  }

  async remove(id: number) : Promise<Review> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la reseña
    const existingReview = await this.findOne(id);
    if(!existingReview) throw new NotFoundException('La reseña no existe');
    // Se elimina la reseña
    const deletedReview = await this.prisma.reviews.delete({
      where: {id},
      include: {
        users: true,
        footage: true
      }
    });
    if(!deletedReview) throw new NotFoundException('La reseña no pudo ser eliminada');
    return deletedReview;
  }
}
