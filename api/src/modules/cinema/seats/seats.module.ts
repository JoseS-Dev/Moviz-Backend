import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service.js';
import { SeatsController } from './seats.controller.js';
import { PrismaService } from '../../../prisma.service.js'

@Module({
  controllers: [SeatsController],
  providers: [SeatsService, PrismaService],
})
export class SeatsModule {}
