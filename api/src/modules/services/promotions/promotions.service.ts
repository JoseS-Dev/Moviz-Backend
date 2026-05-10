import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto.js';
import { UpdatePromotionDto } from './dto/update-promotion.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Promotion } from './entities/promotion.entity.js';
import { generateCodePromotion } from '../../../core/functions/functions.utils.js';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}
  async create(createPromotionDto: CreatePromotionDto) : Promise<Promotion> {
    if(!createPromotionDto) throw new BadRequestException('Los datos no fueron proporcionados');
    // Se verifica que no exista una promoción con el mismo código
    const codePromotion = generateCodePromotion();
    const existingPromotion = await this.prisma.promotions.findUnique({
      where: {code_promotion: codePromotion}
    });
    if(existingPromotion) throw new ConflictException('Ya existe una promoción con ese código');
    // Si todo esta bien, se crea la promoción
    const promotion = await this.prisma.promotions.create({
      data: {
        ...createPromotionDto,
        code_promotion: codePromotion
      }
    });
    if(!promotion) throw new BadRequestException('La promoción no pudo ser creada');
    return promotion;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ) : Promise<{promotions: Promotion[], total: number}> {
    const skip = (page - 1) * limit;
    // Se cuenta el total de registros
    const total = await this.prisma.promotions.count();
    const promotions = await this.prisma.promotions.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    });
    return {promotions, total};
  }

  async findOne(id: number) : Promise<Promotion> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    const promotion = await this.prisma.promotions.findUnique({
      where: {id},
    });
    if(!promotion) throw new NotFoundException('La promoción no existe');
    return promotion;
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto) : Promise<Partial<Promotion>> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la promoción
    const existingPromotion = await this.findOne(id);
    if(!existingPromotion) throw new NotFoundException('La promoción no existe');
    // Se actualiza la promoción correspondiente
    const updatedPromotion = await this.prisma.promotions.update({
      where: {id},
      data: updatePromotionDto
    });
    if(!updatedPromotion) throw new BadRequestException('La promoción no pudo ser actualizada');
    return updatedPromotion;
  }

  async changeStatus(id: number, isActive: boolean) : Promise<Partial<Promotion>> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la promoción
    const existingPromotion = await this.findOne(id);
    if(!existingPromotion) throw new NotFoundException('La promoción no existe');
    // Se actualiza la promoción correspondiente
    const updatedPromotion = await this.prisma.promotions.update({
      where: {id},
      data: {
        is_active: isActive
      }
    });
    if(!updatedPromotion) throw new BadRequestException('La promoción no pudo ser actualizada');
    return updatedPromotion;
  }

  async remove(id: number) : Promise<Promotion> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la promoción
    const existingPromotion = await this.findOne(id);
    if(!existingPromotion) throw new NotFoundException('La promoción no existe');
    // Se elimina la promoción
    const deletedPromotion = await this.prisma.promotions.delete({
      where: {id}
    });
    if(!deletedPromotion) throw new NotFoundException('La promoción no pudo ser eliminada');
    return deletedPromotion;
  }
}
