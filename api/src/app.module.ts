import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ControlModule } from './modules/control/root/root.module.js';
import { CinemaModule } from './modules/cinema/root/root.module.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [ControlModule, CinemaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
