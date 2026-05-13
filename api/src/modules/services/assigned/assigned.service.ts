import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignedDto } from './dto/create-assigned.dto.js';
import { UpdateAssignedDto } from './dto/update-assigned.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Assigned } from './entities/assigned.entity.js';

@Injectable()
export class AssignedService {
  constructor(private prisma: PrismaService) {}
  
  async create(createAssignedDto: CreateAssignedDto) : Promise<Assigned> {
    if(!createAssignedDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista el usuario y la insignia en cuestión
    const [existingUser, existingBadges] = await Promise.all([
      this.prisma.users.findUnique({
        where: {
          id: createAssignedDto.user_id
        }
      }),
      this.prisma.badges.findUnique({
        where: {
          id: createAssignedDto.badge_id
        }
      })
    ]);
    if(!existingUser) throw new NotFoundException('No existe el usuario');
    if(!existingBadges) throw new NotFoundException('No existe la insignia');
    // Se crea la asignación
    const assigned = await this.prisma.userBadges.create({
      data: createAssignedDto
    });
    return assigned;
  }

  async findAll(userId: number,page: number = 1, limit: number = 10): Promise<{ assigneds: Assigned[]; total: number }> {
    if(!userId) throw new BadRequestException('El usuario no fue proporcionado');
    // Se verifica que exista el usuario
    const existingUser = await this.prisma.users.findUnique({
      where: {id: userId}
    });
    if(!existingUser) throw new NotFoundException('No existe el usuario');
    // Se obtienen las asignaciones
    const skip = (page - 1) * limit;
    // Se cuenta todas las insingnias asignadas a dicho usuario
    const total = await this.prisma.userBadges.count({
      where: {
        user_id: userId
      }
    });
    // Se obtienen las insignias asignadas a dicho usuario
    const assigneds = await this.prisma.userBadges.findMany({
      where: {
        user_id: userId
      },
      take: limit,
      skip: skip,
      orderBy: {
        assigned_at: 'desc'
      }
    });
    return { assigneds, total };
  }

  async findOne(id: number): Promise<Assigned> {
    if(!id) throw new BadRequestException('El identificador no fue proporcionado');
    // Se verifica que exista la asignación
    const existingAssigned = await this.prisma.userBadges.findUnique({
      where: {
        id: id
      }
    });
    if(!existingAssigned) throw new NotFoundException('No existe la asignación');
    return existingAssigned;
  }

  async remove(id: number) {
    if(!id) throw new BadRequestException('El identificador no fue proporcionado');
    // Se verifica que exista la asignación
    const existingAssigned = await this.findOne(id);
    if(!existingAssigned) throw new NotFoundException('No existe la asignación');
    // Se elimina la asignación
    const deletedAssigned = await this.prisma.userBadges.delete({
      where: {id}
    });
    if(!deletedAssigned) throw new BadRequestException('No se pudo eliminar la asignación');
    return deletedAssigned;
  }
}
