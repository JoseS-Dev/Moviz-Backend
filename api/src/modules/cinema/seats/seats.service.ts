import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto.js';
import { UpdateSeatDto } from './dto/update-seat.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Seat } from './entities/seat.entity.js';

@Injectable()
export class SeatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSeatDto: CreateSeatDto): Promise<Seat> {
    if (!createSeatDto)
      throw new BadRequestException('No se propocionaron los datos necesarios');
    // Se verifica que exista el salón en cuestión para sillas
    const existingRoom = await this.prisma.rooms.findUnique({
      where: { id: createSeatDto.room_id },
    });
    if (!existingRoom)
      throw new NotFoundException('No existen la sala en cuestión');
    // Si existen , se crea la silla
    const newSeats = await this.prisma.seats.create({
      data: createSeatDto,
    });
    if (!newSeats)
      throw new BadRequestException(
        'No se pudo crear la silla correspondiente a dicha sala',
      );
    return newSeats;
  }

  async findAll(
    roomId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ seats: Seat[]; total: number }> {
    if (!roomId)
      throw new BadRequestException(
        'No se propociono el ID de la sala a obtener todas las sillas',
      );
    // Se verifica que exista la sala para obtener sus sillas
    const existingRoom = await this.prisma.rooms.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom)
      throw new NotFoundException('No existe la sala correspondiente');
    // Si existe se obtiene las sillas de dichas sala
    const skip = (page - 1) * limit;
    // Se cuenta el total de silla en dicha sala
    const totalSeats = await this.prisma.seats.count({
      where: { room_id: roomId },
    });
    if (totalSeats > existingRoom.capacity_room)
      throw new UnprocessableEntityException(
        `Capacidad excedida: Intentas registrar ${totalSeats} asientos en una sala con capacidad para ${existingRoom.capacity_room}`,
      );
    const seats = await this.prisma.seats.findMany({
      skip: skip,
      take: limit,
    });
    return { seats, total: totalSeats };
  }

  async findOne(id: number): Promise<Seat> {
    if (!id)
      throw new BadRequestException('El ID de la silla no se propociono');
    const existingSeat = await this.prisma.seats.findUnique({
      where: { id },
    });
    if (!existingSeat)
      throw new NotFoundException('No existe la silla en cuestión');
    return existingSeat;
  }

  async update(
    id: number,
    updateSeatDto: UpdateSeatDto,
  ): Promise<Partial<Seat>> {
    if (!id)
      throw new BadRequestException(
        'El ID no fue propociono de la silla a actualizar',
      );
    if (!updateSeatDto)
      throw new BadRequestException(
        'Los datos a actualizar no fueron propocionados',
      );
    // Se verifica si existe la silla a actualizar
    const existingSeat = await this.prisma.seats.findUnique({
      where: { id },
    });
    if (!existingSeat)
      throw new NotFoundException('No existe la silla a actualizar');
    // Si existe se procede a actualizar
    const updatedSeat = await this.prisma.seats.update({
      where: { id },
      data: {
        ...updateSeatDto,
        updated_at: new Date(),
      },
    });
    if (!updatedSeat)
      throw new BadRequestException(
        'No se pudo a actualizar la silla correspondiente',
      );
    return updatedSeat;
  }

  async changeStatusAvailable(id: number, isActive: boolean): Promise<Seat> {
    if (!id)
      throw new BadRequestException('El ID de la silla no fue propocionado');
    // Se verifica que exista la silla en cuestión
    const existingSeat = await this.findOne(id);
    if (!existingSeat)
      throw new NotFoundException(
        'No existe la silla a actualizar su estado de disponibilidad',
      );
    // Si existe se cambia el estado de disponibilidad
    const updatedStatus = await this.prisma.seats.update({
      where: { id },
      data: {
        is_available: isActive,
      },
    });
    if (!updatedStatus)
      throw new BadRequestException(
        'No se pudo a actualziar el estado de la silla',
      );
    return updatedStatus;
  }

  async remove(id: number): Promise<Seat> {
    if (!id)
      throw new BadRequestException(
        'No se propociono el ID de la silla a eliminar',
      );
    // Se verifica que exista la silla a eliminar
    const existingSeat = await this.findOne(id);
    if (!existingSeat)
      throw new NotFoundException('No existe la silla a eliminar');
    // Se elimina la silla
    const deletedSeats = await this.prisma.seats.delete({
      where: { id },
    });
    if (!deletedSeats)
      throw new BadRequestException('No se pudo eliminar la silla en cuestión');
    return deletedSeats;
  }
}
