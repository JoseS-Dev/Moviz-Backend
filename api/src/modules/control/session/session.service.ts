import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CreateSessionDto } from './dto/create-session.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(createSessionDto: CreateSessionDto) {
    if (!createSessionDto)
      throw new NotFoundException('No se propocionaron los datos de login');
    // Se verifica que el usuario exista con el gmail
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createSessionDto.email },
    });
    if (!existingUser)
      throw new NotFoundException(
        'No se encontró un usuario con el correo proporcionado',
      );
    // Se verifica que la contraseña sea la correcta
    const isPasswordValid = await bcrypt.compare(
      createSessionDto.password,
      existingUser.password_hash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');
    // Si todo esta bien generamos el token JWT
    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };
    const token = this.jwtService.sign(payload);
    // Se verifica si ya el ususario habiado iniciado sesión antes
    const existingSession = await this.prisma.sessions.findFirst({
      where: { user_id: existingUser.id },
    });
    if (existingSession) {
      // Si ya habia iniciado sesión se actualiza el token
      const updatedSession = await this.prisma.sessions.update({
        where: { id: existingSession.id },
        data: {
          token: token,
          updated_at: new Date(),
        },
      });
      if (!updatedSession)
        throw new BadRequestException('No se pudo actualizar la sesión');
      return updatedSession;
    } else {
      // Si no habia iniciado sesión se crea una nueva sesión
      const newSession = await this.prisma.sessions.create({
        data: {
          user_id: existingUser.id,
          token: token,
        },
      });
      if (!newSession)
        throw new BadRequestException('No se pudo crear la sesión');
      return newSession;
    }
  }

  async logout(userId: number) {
    // Se verifica que el usuario exista
    const exisitingUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!exisitingUser)
      throw new NotFoundException(
        'No se encontró un usuario con el ID proporcionado',
      );
    // Se verifica si existe la sessión del usuario
    const existingSession = await this.prisma.sessions.findFirst({
      where: { user_id: userId },
    });
    if (!existingSession)
      throw new NotFoundException(
        'No se encontró una sesión para el usuario proporcionado',
      );
    // Si existe la sesión se elimina el token
    const deletedSession = await this.prisma.sessions.update({
      where: { id: existingSession.id },
      data: { token: null },
    });
    if (!deletedSession)
      throw new BadRequestException('No se pudo cerrar la sesión');
    return deletedSession;
  }
}
