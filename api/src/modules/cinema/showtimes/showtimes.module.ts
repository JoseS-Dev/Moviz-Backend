import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service.js';
import { ShowtimesController } from './showtimes.controller.js';
import { PrismaService } from '../../../prisma.service.js';

@Module({
  controllers: [ShowtimesController],
  providers: [ShowtimesService, PrismaService],
})
export class ShowtimesModule {}
