import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import { BadgesController } from './badges.controller.js';
import { PrismaService } from '../../../prisma.service.js'

@Module({
  controllers: [BadgesController],
  providers: [BadgesService, PrismaService],
})
export class BadgesModule {}
