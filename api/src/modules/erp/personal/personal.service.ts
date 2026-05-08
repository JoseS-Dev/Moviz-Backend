import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto.js';
import { UpdatePersonalDto } from './dto/update-personal.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Personal } from './entities/personal.entity.js';

@Injectable()
export class PersonalService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(createPersonalDto: CreatePersonalDto) : Promise<Personal> {
    if(!createPersonalDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que no exista un usuario con el mismo correo
    const existingStaff = await this.prisma.staff.findUnique({
      where: {email_staff: createPersonalDto.email_staff}
    });
    if(!existingStaff) throw new ConflictException('Ya existe un personal con dicho correo');
    // Si no existe se crea el personal
    const newStaff = await this.prisma.staff.create({
      data: createPersonalDto
    });
    if(!newStaff) throw new BadRequestException('No se pudo crear el staff');
    return newStaff
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{staff: Personal[], total: number}> {
    const skipe = (page - 1) * limit;
    // Se calcula el numero total de resultados
    const total = await this.prisma.staff.count();
    // Se obtiene la lista del personal
    const staff = await this.prisma.staff.findMany({
      skip: skipe,
      take: limit,
      orderBy: {
        hired_at: 'desc',
      },
    });
    return {staff, total};
  }

  async findOne(id: number): Promise<Personal> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    const staff = await this.prisma.staff.findUnique({
      where: {id}
    });
    if(!staff) throw new NotFoundException('No se encontro el staff');
    return staff;
  }

  async update(id: number, updatePersonalDto: UpdatePersonalDto) : Promise<Partial<Personal>> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    if(!updatePersonalDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista el personal
    const existingStaff = await this.findOne(id);
    if(!existingStaff) throw new NotFoundException('No se encontro el staff');
    // Se actualiza el personal
    const updatedStaff = await this.prisma.staff.update({
      where: {id},
      data: updatePersonalDto
    });
    if(!updatedStaff) throw new BadRequestException('No se pudo actualizar el staff');
    return updatedStaff;
  }

  async changeStatus(id: number, isActive: boolean) : Promise<Personal> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista el personal
    const existingStaff = await this.findOne(id);
    if(!existingStaff) throw new NotFoundException('No se encontro el staff');
    // Se actualiza el personal
    const updatedStaff = await this.prisma.staff.update({
      where: {id},
      data: {is_active: isActive}
    });
    if(!updatedStaff) throw new BadRequestException('No se pudo actualizar el staff');
    return updatedStaff;
  }

  async remove(id: number) : Promise<Personal> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista el personal
    const existingStaff = await this.findOne(id);
    if(!existingStaff) throw new NotFoundException('No se encontro el staff');
    // Se elimina el personal
    const deletedStaff = await this.prisma.staff.delete({
      where: {id}
    });
    if(!deletedStaff) throw new BadRequestException('No se pudo eliminar el staff');
    return deletedStaff;
  }
}
