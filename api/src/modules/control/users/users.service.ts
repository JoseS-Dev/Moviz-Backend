import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { PrismaService } from '../../../prisma.service.js';
import bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto)
      throw new BadRequestException(
        'Los datos de creación del usuario son requeridos.',
      );
    // Se verifica si el email ya existe
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser)
      throw new BadRequestException('El email ya está registrado.');
    // se hashea la contraseña antes de guardarla
    const hashed = await bcryptjs.hash(createUserDto.password_hash, 10);
    // Si no existe el email, se crea el usuario
    const newUser = await this.prisma.users.create({
      data: {
        ...createUserDto,
        password_hash: hashed,
      },
      include: {
        reviews: true,
        bookings: true,
      },
    });
    if (!newUser) throw new BadRequestException('No se pudo crear el usuario.');
    return newUser;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    // Calcular el offset para la paginación
    const skip = (page - 1) * limit;
    // Obtenemos el total de usuarios para verificar si la página solicitada es válida
    const totalUsers = await this.prisma.users.count();
    if (skip >= totalUsers)
      throw new BadRequestException(
        'No se encontraron usuarios para la página solicitada.',
      );
    // Se obtiene la lista de usuarios con paginación
    const users = await this.prisma.users.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        reviews: true,
        bookings: true,
      },
    });
    return { users, total: totalUsers };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { id: id },
    });
    if (!user)
      throw new BadRequestException(`No se encontró el usuario con ID ${id}.`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });
    if (!user)
      throw new BadRequestException(
        `No se encontró el usuario con email ${email}.`,
      );
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Se verifica si el usuario existe
    const existingUser = await this.findOne(id);
    if (!existingUser)
      throw new BadRequestException(`No se encontró el usuario con ID ${id}.`);
    // Si se va actualizar le correo, se verifica que no exista otro usuario con ese correo
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.findByEmail(updateUserDto.email);
      if (emailExists)
        throw new BadRequestException(
          'El email ya está registrado por otro usuario.',
        );
    }
    // Si se va actualizar la contraseña, se hashea antes de guardarla
    if (updateUserDto.password_hash) {
      updateUserDto.password_hash = await bcryptjs.hash(
        updateUserDto.password_hash,
        10,
      );
    }
    // Se actualiza el usuario
    const updatedUser = await this.prisma.users.update({
      where: { id: id },
      data: {
        ...updateUserDto,
        updated_at: new Date(),
      },
    });
    if (!updatedUser)
      throw new BadRequestException('No se pudo actualizar el usuario.');
    return updatedUser;
  }

  async remove(id: number): Promise<User> {
    // Se verifica que exista el usuario antes de eliminarlo
    const existingUser = await this.findOne(id);
    if (!existingUser)
      throw new BadRequestException(`No se encontró el usuario con ID ${id}.`);
    // Si existe, se elimina el usuario
    const deleted = await this.prisma.users.delete({
      where: { id: id },
    });
    if (!deleted)
      throw new BadRequestException('No se pudo eliminar el usuario.');
    return deleted;
  }
}
