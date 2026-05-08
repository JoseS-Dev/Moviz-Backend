import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ControlModule } from './modules/control/root/root.module.js';
import { CinemaModule } from './modules/cinema/root/root.module.js';
import { ServicesModule } from './modules/services/root/root.module.js';
import { ERPModule } from './modules/erp/root/root.module.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [ControlModule, CinemaModule, ServicesModule, ERPModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
