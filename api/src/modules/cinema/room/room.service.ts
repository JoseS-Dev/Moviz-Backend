import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { generateCodeRoom } from '../../../core/functions/functions.utils.js';
import { Room } from './entities/room.entity.js';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    if (!createRoomDto)
      throw new BadRequestException('Los datos no fueron propocionados');
    // Se crea el codigo para la sala
    const code = generateCodeRoom(8);
    // Se verifica que no exista una sala con el mismo codigo de sala
    const existingRoom = await this.prisma.rooms.findUnique({
      where: { code_room: code },
    });
    if (existingRoom)
      throw new ConflictException('Ya existe una sala con este codigo de sala');
    // Si no existe la sala se procede a crear la sala
    const newRoom = await this.prisma.rooms.create({
      data: {
        ...createRoomDto,
        code_room: code,
      },
    });
    if (!newRoom) throw new BadRequestException('No se pudo crear la sala');
    return newRoom;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ rooms: Room[]; total: number }> {
    const skip = (page - 1) * limit;
    // Se cuenta cunatas salas hay en el sistema
    const totalRoom = await this.prisma.rooms.count();
    // Se obtiene todas las salas
    const rooms = await this.prisma.rooms.findMany({
      skip: skip,
      take: limit,
    });
    return { rooms, total: totalRoom };
  }

  async findOne(id: number): Promise<Room> {
    if (!id) throw new BadRequestException('Se propociono el ID de la sala');
    const room = await this.prisma.rooms.findUnique({
      where: { id },
    });
    if (!room) throw new NotFoundException('No existe una sala con ese ID');
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    if (!id)
      throw new BadRequestException(
        'No se propociono el ID de la sala a modificar',
      );
    if (!updateRoomDto)
      throw new BadRequestException(
        'Los datos a actualizar no se propocionaron',
      );
    // Se verifica que exista la sala a modificar
    const existingRoom = await this.findOne(id);
    if (!existingRoom)
      throw new NotFoundException('No existe la sala que se va actualizar');
    // Se procede a actualizar la sala correspondiente
    const updatedRoom = await this.prisma.rooms.update({
      where: { id },
      data: {
        ...updateRoomDto,
        updated_at: new Date(),
      },
    });
    if (!updatedRoom)
      throw new BadRequestException('No se pudo actualizar la sala');
    return updatedRoom;
  }

  async changeStatus(id: number, isActive: boolean): Promise<Room> {
    if (!id)
      throw new BadRequestException(
        'No se propociono el ID de la sala a modificar',
      );
    // Se verifica que exista la sala a modificar su estado
    const existingRoom = await this.findOne(id);
    if (!existingRoom)
      throw new NotFoundException('No existe la sala que se va actualizar');
    const changeStatusRoom = await this.prisma.rooms.update({
      where: { id },
      data: {
        is_active: isActive,
      },
    });
    if (!changeStatusRoom)
      throw new BadRequestException(
        'No se pudo actualizar el estado de la sala',
      );
    return changeStatusRoom;
  }

  async remove(id: number): Promise<Room> {
    if (!id)
      throw new BadRequestException('No se propociono el Id de la pelicula');
    // Se verifica la pelicula existan
    const existingRoom = await this.findOne(id);
    if (!existingRoom)
      throw new NotFoundException('No se encontro la pelicula a eliminar');
    // Si existe, se elimina la pelicula
    const deletedRoom = await this.prisma.rooms.delete({
      where: { id },
    });
    if (!deletedRoom)
      throw new BadRequestException('No se pudo eliminar la pelicula');
    return deletedRoom;
  }
}
