import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { SessionController } from './session.controller.js';
import { PrismaService } from '../../../prisma.service.js'
import { JwtModule } from '@nestjs/jwt';
import { settings } from '../../../../config/settings.config.js';
import { SessionGuard } from './guards/session.guards.js';


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: settings.jwtSecretKey,
        signOptions: {expiresIn: '1h'}
      })
    })
  ],
  controllers: [SessionController],
  providers: [SessionService, PrismaService, SessionGuard],
})

export class SessionModule {}
