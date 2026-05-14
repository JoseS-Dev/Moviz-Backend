import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Notification } from './entities/notification.entity.js';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}
  async create(createNotificationDto: CreateNotificationDto) : Promise<Notification> {
    if(!createNotificationDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista el usuario
    const existingUser = await this.prisma.users.findUnique({
      where: {id: createNotificationDto.user_id}
    });
    if(!existingUser) throw new NotFoundException('El usuario no existe');
    // Se crea la notificación
    const newNotification = await this.prisma.notifications.create({
      data: createNotificationDto
    });
    if(!newNotification) throw new BadRequestException('La notificación no pudo ser creada');
    return newNotification;
  }

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ) : Promise<{total: number, notifications: Notification[]}> {
    if(!userId) throw new BadRequestException('El usuario no fue proporcionado');
    // Se verifica que exista el usuario
    const existingUser = await this.prisma.users.findUnique({
      where: {id: userId}
    });
    if(!existingUser) throw new NotFoundException('El usuario no existe');
    // Se obtiene la lista de notificaciones
    const skip = (page - 1) * limit;
    // Se cuenta el total de notificaciones
    const total = await this.prisma.notifications.count({
      where: {user_id: userId}
    });
    const notifications = await this.prisma.notifications.findMany({
      skip: skip,
      take: limit,
      where: {user_id: userId},
      orderBy: {created_at: 'desc'}
    });
    return {
      total,
      notifications
    };
  }

  async findOne(id: number) : Promise<Notification> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la notificación
    const existingNotification = await this.prisma.notifications.findUnique({
      where: {id}
    });
    if(!existingNotification) throw new NotFoundException('La notificación no existe');
    return existingNotification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) : Promise<Partial<Notification>> {
    if(!id) throw new BadRequestException('El id no fue proporcionado');
    if(!updateNotificationDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista la notificación
    const existingNotification = await this.findOne(id);
    if(!existingNotification) throw new NotFoundException('La notificación no existe');
    // Si existe se acttualiza el estado de la notificación
    const updatedNotification = await this.prisma.notifications.update({
      where: {id},
      data: updateNotificationDto
    });
    if(!updatedNotification) throw new BadRequestException('La notificación no pudo ser actualizada');
    return updatedNotification;
  }

  async markAsReadAll(userId: number) : Promise<Notification[]>{
    if(!userId) throw new BadRequestException('El usuario no fue proporcionado');
    // Se verifica que exista el usuario
    const existingUser = await this.prisma.users.findUnique({
      where: {id: userId}
    });
    if(!existingUser) throw new NotFoundException('El usuario no existe');
    // Se marca todas las notificaciones como leidas
    const updatedNotifications = await this.prisma.notifications.updateMany({
      where: {user_id: userId},
      data: {is_read: true}
    });
    if(!updatedNotifications) throw new BadRequestException('Las notificaciones no pudieron ser marcadas como leidas');
    // Se obtiene la lista de notificaciones
    const notifications = await this.prisma.notifications.findMany({
      where: {user_id: userId},
      orderBy: {created_at: 'desc'}
    });
    return notifications;
  }

  async remove(id: number) : Promise<Notification> {
    if(!id) throw new BadRequestException('El id no fue proporcionado');
    // Se verifica que exista la notificación
    const existingNotification = await this.findOne(id);
    if(!existingNotification) throw new NotFoundException('La notificación no existe');
    // Si existe se elimina la notificación
    const deletedNotification = await this.prisma.notifications.delete({
      where: {id}
    });
    if(!deletedNotification) throw new BadRequestException('La notificación no pudo ser eliminada');
    return deletedNotification;
  }
}
