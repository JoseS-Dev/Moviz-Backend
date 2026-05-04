import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto.js';
import { UpdateShowtimeDto } from './dto/update-showtime.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Showtime } from './entities/showtime.entity.js';

@Injectable()
export class ShowtimesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    if (!createShowtimeDto)
      throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que la pelicula y la sala existan
    const [existingFootage, existingRoom] = await Promise.all([
      this.prisma.footage.findUnique({
        where: { id: createShowtimeDto.movie_id },
      }),
      this.prisma.rooms.findUnique({
        where: { id: createShowtimeDto.room_id },
      }),
    ]);
    if (!existingFootage)
      throw new NotFoundException('No existe la pelciula de la función');
    if (!existingRoom)
      throw new NotFoundException('No se encontro la sala en cuestión');
    // Si todo esta bien se crea la función
    const newShowtime = await this.prisma.showtimes.create({
      data: createShowtimeDto,
    });
    if (!newShowtime)
      throw new BadRequestException('No se pudo crear la función');
    return newShowtime;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ showtimes: Showtime[]; total: number }> {
    const skip = (page - 1) * limit;
    // Se cuenta el numero de función que hya en el sistema
    const totalShowTimes = await this.prisma.showtimes.count();
    // Se obtiene todas las funciones
    const showtimes = await this.prisma.showtimes.findMany({
      skip: skip,
      take: limit,
    });
    return { showtimes, total: totalShowTimes };
  }

  async findAllByRoom(
    roomId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ showtimes: Showtime[]; total: number }> {
    if (!roomId)
      throw new BadRequestException('No se propociono el id de la sala');
    // Se verifica que la sala existe
    const existingRoom = await this.prisma.rooms.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom)
      throw new NotFoundException('No se encontro la sala en cuestión');
    // Si la sala existe se busca todas sus funciones
    const skip = (page - 1) * limit;
    const totalShowTimes = await this.prisma.showtimes.count({
      where: { room_id: roomId },
    });
    const showtimes = await this.prisma.showtimes.findMany({
      where: { room_id: roomId },
      skip: skip,
      take: limit,
      orderBy: { end_time: 'desc' },
    });
    return { showtimes, total: totalShowTimes };
  }

  async findOne(id: number): Promise<Showtime> {
    if (!id)
      throw new BadRequestException('No se propociono el id de la función');
    // Se verifica que la función exista
    const existingShowtime = await this.prisma.showtimes.findUnique({
      where: { id: id },
    });
    if (!existingShowtime)
      throw new NotFoundException('No se encontro la función');
    return existingShowtime;
  }

  async update(
    id: number,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<Partial<Showtime>> {
    if (!id)
      throw new BadRequestException('No se propociono el id de la función');
    if (!updateShowtimeDto)
      throw new BadRequestException(
        'No se propocionaron los datos a actualizar',
      );
    // Se verifica si existe la función a actualizar
    const existingShowtime = await this.findOne(id);
    if (!existingShowtime)
      throw new NotFoundException('No se encontro la función');
    // Se verifica si la función esta activa, en caso de que la función ya este programada no se puede actualizar
    if (existingShowtime.status_showtime !== 'Programada')
      throw new BadRequestException(
        'No se puede actualizar una función que no esta programada',
      );
    // Se verifica que la sala no este en mantenimiento
    const existingRoom = await this.prisma.rooms.findFirst({
      where: { id: existingShowtime.room_id, last_maintenance: null },
    });
    if (!existingRoom)
      throw new BadRequestException('La sala esta en mantenimiento');
    // Si todo esta bien se actualiza la función correspondiente
    const updatedShowtime = await this.prisma.showtimes.update({
      where: { id: id },
      data: updateShowtimeDto,
    });
    if (!updatedShowtime)
      throw new BadRequestException('No se pudo actualizar la función');
    return updatedShowtime;
  }

  async remove(id: number): Promise<Showtime> {
    if (!id)
      throw new BadRequestException('No se propociono el id de la función');
    // Se verifica que la función exista
    const existingShowtime = await this.findOne(id);
    if (!existingShowtime)
      throw new NotFoundException('No se encontro la función');
    // Si todo esta bien se elimina la función correspondiente
    const deletedShowtime = await this.prisma.showtimes.delete({
      where: { id: id },
    });
    if (!deletedShowtime)
      throw new BadRequestException('No se pudo eliminar la función');
    return deletedShowtime;
  }
}
