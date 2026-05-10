import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service.js';
import { PromotionsController } from './promotions.controller.js';
import { PrismaService } from '../../../prisma.service.js'

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService, PrismaService],
})
export class PromotionsModule {}
