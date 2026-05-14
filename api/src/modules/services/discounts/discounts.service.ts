import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto.js';
import { UpdateDiscountDto } from './dto/update-discount.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Discount } from './entities/discount.entity.js';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}
  
  async create(createDiscountDto: CreateDiscountDto) : Promise<Discount> {
    if(!createDiscountDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista el usuario y la promición asociados
    const [existingUser, existingPromotion] = await Promise.all([
      this.prisma.users.findUnique({
        where: {
          id: createDiscountDto.user_id
        }
      }),
      this.prisma.promotions.findUnique({
        where: {
          id: createDiscountDto.promotion_id
        }
      })
    ]);
    if(!existingUser) throw new NotFoundException('El usuario no existe');
    if(!existingPromotion) throw new NotFoundException('La promoción no existe');
    // Si todo esta bien, se crea la relación 
    const newRDiscount = await this.prisma.userPromotions.create({
      data: createDiscountDto
    });
    if(!newRDiscount) throw new BadRequestException('La promoción no pudo ser creada');
    return newRDiscount;
  }

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ) : Promise<{total: number, discounts: Discount[]}> {
    if(!userId) throw new BadRequestException('El usuario no fue proporcionado');
    // Se verifica que exista el usuario
    const existingUser = await this.prisma.users.findUnique({
      where: {id: userId}
    });
    if(!existingUser) throw new NotFoundException('El usuario no existe');
    // Se obtiene la lista de promociones que fueron asignadas a dicho usuarios
    const skip = (page - 1) * limit;
    // Se cuenta el total de promociones
    const total = await this.prisma.userPromotions.count({
      where: {user_id: userId}
    });
    // Se obtiene la lista de promociones
    const discounts = await this.prisma.userPromotions.findMany({
      where: {user_id: userId},
      skip,
      take: limit,
      orderBy: {assigned_at: 'desc'}
    });
    return {
      total,
      discounts
    };
  }

  async findOne(id: number) : Promise<Discount> {
    if(!id) throw new BadRequestException('El id no fue proporcionado');
    // Se verifica que exista la promoción
    const existingDiscount = await this.prisma.userPromotions.findUnique({
      where: {id}
    });
    if(!existingDiscount) throw new NotFoundException('La promoción no existe');
    return existingDiscount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) : Promise<Discount>{
    if(!id) throw new BadRequestException('El id no fue proporcionado');
    if(!updateDiscountDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista la promoción
    const existingDiscount = await this.findOne(id);
    if(!existingDiscount) throw new NotFoundException('La promoción no existe');
    // Si existe se acttualiza el esado de uso
    const updatedDiscount = await this.prisma.userPromotions.update({
      where: {id},
      data: updateDiscountDto
    });
    if(!updatedDiscount) throw new BadRequestException('La promoción no pudo ser actualizada');
    return updatedDiscount;
  }

  async remove(id: number) : Promise<Discount> {
    if(!id) throw new BadRequestException('El id no fue proporcionado');
    // Se verifica que exista la promoción
    const existingDiscount = await this.findOne(id);
    if(!existingDiscount) throw new NotFoundException('La promoción no existe');
    // Si existe se elimina la relación
    const deletedDiscount = await this.prisma.userPromotions.delete({
      where: {id}
    });
    if(!deletedDiscount) throw new BadRequestException('La promoción no pudo ser eliminada');
    return deletedDiscount;
  }
}
