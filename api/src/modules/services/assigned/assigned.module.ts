import { Module } from '@nestjs/common';
import { AssignedService } from './assigned.service.js';
import { AssignedController } from './assigned.controller.js';
import { PrismaService } from '../../../prisma.service.js';

@Module({
  controllers: [AssignedController],
  providers: [AssignedService, PrismaService],
})
export class AssignedModule {}
