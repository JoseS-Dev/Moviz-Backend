import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ControlModule } from './modules/control/root/root.module.js';
import { CinemaModule } from './modules/cinema/root/root.module.js';
import { ServicesModule } from './modules/services/root/root.module.js';
import { ERPModule } from './modules/erp/root/root.module.js';
import { PrismaService } from './prisma.service.js';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';

@Module({
  imports: [
    ControlModule, 
    CinemaModule, 
    ServicesModule, 
    ERPModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 30,
        }
      ]
    })
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
