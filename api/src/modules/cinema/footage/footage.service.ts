import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFootageDto } from './dto/create-footage.dto.js';
import { UpdateFootageDto } from './dto/update-footage.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Footage } from './entities/footage.entity.js';

@Injectable()
export class FootageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFootageDto: CreateFootageDto): Promise<Footage> {
    if (!createFootageDto)
      throw new BadGatewayException(
        'Los datos no fueron propocionados para crear una pelicula',
      );
    // Se verifica que no exista una pelicula con el mismo el nombre
    const existingFootage = await this.prisma.footage.findFirst({
      where: { title_footage: createFootageDto.title_footage },
    });
    if (existingFootage)
      throw new ConflictException('Ya existe un pelicula con el mismo nombre');
    // Si no existe una pelicula con el mismo nombre se crea dicha pelicula
    const newFootage = await this.prisma.footage.create({
      data: createFootageDto,
    });
    if (!newFootage)
      throw new BadRequestException('No se pudo crear la pelicula');
    return newFootage;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ footages: Footage[]; total: number }> {
    const skip = (page - 1) * limit;
    // Obtenemos el total de las peliculas que hay en el sistema
    const totalFootage = await this.prisma.footage.count();
    if (skip >= totalFootage)
      throw new BadRequestException(
        'No se encontraron peliculas para la página solicitada.',
      );
    const footages = await this.prisma.footage.findMany({
      skip: skip,
      take: limit,
    });
    return { footages, total: totalFootage };
  }

  async findOne(id: number): Promise<Footage> {
    const footage = await this.prisma.footage.findUnique({
      where: { id },
    });
    if (!footage)
      throw new NotFoundException('No se encontro la pelicula solicitada');
    return footage;
  }

  async update(
    id: number,
    updateFootageDto: UpdateFootageDto,
  ): Promise<Partial<Footage>> {
    if (!id)
      throw new BadRequestException(
        'No se encontro el id de la pelicula a actualizar',
      );
    if (!updateFootageDto)
      throw new BadRequestException(
        'No se propocionaron los datos a actualizar',
      );
    // Se verifica que exista la pelicula
    const existingFootage = await this.prisma.footage.findUnique({
      where: { id },
    });
    if (!existingFootage)
      throw new NotFoundException('No se encotro la pelicula a actualizar');
    // Si se va a actualizar el nombre se verifica que no exista una pelicula igual con el nombre actualizado
    if (updateFootageDto.title_footage) {
      const existingFootageWithName = await this.prisma.footage.findFirst({
        where: { title_footage: updateFootageDto.title_footage },
      });
      if (existingFootageWithName)
        throw new ConflictException(
          'Ya existe una pelicula con el mismo nombre',
        );
    }
    // Se procede a actualizar la pelicula
    const updatedFootage = await this.prisma.footage.update({
      where: { id },
      data: {
        ...updateFootageDto,
        updated_at: new Date(),
      },
    });
    if (!updatedFootage)
      throw new BadRequestException('No se pudo actualizar la pelicula');
    return updatedFootage;
  }

  async changeStatus(id: number, isActive: boolean): Promise<Footage> {
    if (!id) throw new BadRequestException('El id no fue propocionado');
    // Se verifica que la pelicula exista
    const existingFootage = await this.findOne(id);
    if (!existingFootage)
      throw new NotFoundException('No existe la pelicula a cambiar su estado');
    // Si existe se le cambia el estado de la pelicula
    const changeStatusFootage = await this.prisma.footage.update({
      where: { id },
      data: { is_active: isActive },
    });
    if (!changeStatusFootage)
      throw new BadRequestException(
        'No se pudo actualizar el estado de la pelicula',
      );
    return changeStatusFootage;
  }

  async remove(id: number): Promise<Footage> {
    if (!id)
      throw new BadRequestException('No se propociono el Id de la pelicula');
    // Se verifica la pelicula existan
    const existingFootage = await this.findOne(id);
    if (!existingFootage)
      throw new NotFoundException('No se encontro la pelicula a eliminar');
    // Si existe, se elimina la pelicula
    const deletedFootage = await this.prisma.footage.delete({
      where: { id },
    });
    if (!deletedFootage)
      throw new BadRequestException('No se pudo eliminar la pelicula');
    return deletedFootage;
  }
}
