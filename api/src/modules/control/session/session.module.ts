import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { SessionController } from './session.controller.js';
import { PrismaService } from '../../../prisma.service.js'
import { JwtModule } from '@nestjs/jwt';
import { settings } from '../../../../config/settings.config.js';
import { SessionAuthenticationMiddleware } from './guards/session.guards.js';
import { RequestMethod } from '@nestjs/common';

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
  providers: [SessionService, PrismaService],
})

export class SessionModule {
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(SessionAuthenticationMiddleware)
    .forRoutes(
      { path: 'session/logout', method: RequestMethod.POST },
      { path: 'session/verify', method: RequestMethod.GET }
    )
  }
}
