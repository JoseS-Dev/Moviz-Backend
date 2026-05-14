import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service.js';
import { DiscountsController } from './discounts.controller.js';
import { PrismaService } from '../../../prisma.service.js';

@Module({
  controllers: [DiscountsController],
  providers: [DiscountsService, PrismaService],
})
export class DiscountsModule {}
