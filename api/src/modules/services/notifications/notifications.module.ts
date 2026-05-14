import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { PrismaService } from '../../../prisma.service.js';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
})
export class NotificationsModule {}
