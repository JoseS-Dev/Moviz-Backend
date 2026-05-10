import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto.js';
import { UpdateBadgeDto } from './dto/update-badge.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Badge } from './entities/badge.entity.js';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}
  
  async create(createBadgeDto: CreateBadgeDto, filePath?: string) : Promise<Badge> {
    if(!createBadgeDto) throw new BadRequestException('Los datos no fueron proporcionados');
    // Se verifica que no exista una insignia con el mismo nombre
    const existingBadge = await this.prisma.badges.findFirst({
      where: {name_badge: createBadgeDto.name_badge}
    });
    if(existingBadge) throw new ConflictException('Ya existe una insignia con ese nombre');
    // Si todo esta bien, se crea la insignia
    const badge = await this.prisma.badges.create({
      data: {
        ...createBadgeDto,
        icon_badge: filePath || ''
      }
    });
    if(!badge) throw new BadRequestException('La insignia no pudo ser creada');
    return badge;
  }

  async findAll(page: number = 1, limit: number = 10) : Promise<{badges: Badge[], total: number}> {
    const skip = (page - 1) * limit;
    // Se cuenta el total de registros
    const total = await this.prisma.badges.count();
    const badges = await this.prisma.badges.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    });
    return {badges, total};
  }

  async findOne(id: number) : Promise<Badge> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    const badge = await this.prisma.badges.findUnique({
      where: {id},
    });
    if(!badge) throw new BadRequestException('La insignia no existe');
    return badge;
  }

  async update(id: number, updateBadgeDto: UpdateBadgeDto) : Promise<Partial<Badge>> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la insignia
    const existingBadge = await this.findOne(id);
    if(!existingBadge) throw new BadRequestException('La insignia no existe');
    // Se actualiza la insignia correspondiente
    const updatedBadge = await this.prisma.badges.update({
      where: {id},
      data: updateBadgeDto
    });
    if(!updatedBadge) throw new BadRequestException('La insignia no pudo ser actualizada');
    return updatedBadge;
  }

  async changeStatus(id: number, isActive: boolean) : Promise<Partial<Badge>> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la insignia
    const existingBadge = await this.findOne(id);
    if(!existingBadge) throw new BadRequestException('La insignia no existe');
    // Se actualiza la insignia correspondiente
    const updatedBadge = await this.prisma.badges.update({
      where: {id},
      data: {
        is_active: isActive
      }
    });
    if(!updatedBadge) throw new BadRequestException('La insignia no pudo ser actualizada');
    return updatedBadge;
  }

  async remove(id: number) : Promise<Badge> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la insignia
    const existingBadge = await this.findOne(id);
    if(!existingBadge) throw new BadRequestException('La insignia no existe');
    // Se elimina la insignia
    const deletedBadge = await this.prisma.badges.delete({
      where: {id}
    });
    if(!deletedBadge) throw new BadRequestException('La insignia no pudo ser eliminada');
    return deletedBadge;
  }
}
