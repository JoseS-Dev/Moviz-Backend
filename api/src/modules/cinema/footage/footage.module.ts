import { Module } from '@nestjs/common';
import { FootageService } from './footage.service.js';
import { FootageController } from './footage.controller.js';
import { PrismaService } from '../../../prisma.service.js';

@Module({
  controllers: [FootageController],
  providers: [FootageService, PrismaService],
})
export class FootageModule {}
