import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DefaultValuePipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exception.filter.js';
import { ResponseInterceptor } from './common/inteceptors/api.interceptor.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { settings } from '../config/settings.config.js';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));

  app.setGlobalPrefix(settings.basePath);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new DefaultValuePipe({
      whiteList: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Moviz API')
    .setDescription('API de Moviz')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    }, 'access_token')
    .build();
  
  if(settings.nodeEnv !== 'production'){
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${settings.basePath}/docs`, app, document, {
      swaggerOptions: {
        filter: true,
        customSiteTitle: 'Moviz API',
        persistAuthorization: true,
      }
    });
  }

  app.enableCors({
    origin: settings.corsOrigin,
    credentials: true,
  });

  await app.listen(settings.port, () => {
    console.log(
      `Servidor escuchando en http://localhost:${settings.port}${settings.basePath}`,
    );
  });
}
bootstrap();
