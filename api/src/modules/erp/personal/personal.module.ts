import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service.js';
import { PersonalController } from './personal.controller.js';
import { PrismaService } from '../../../prisma.service.js'

@Module({
  controllers: [PersonalController],
  providers: [PersonalService, PrismaService],
})
export class PersonalModule {}
