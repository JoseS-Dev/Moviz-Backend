import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { settings } from '../config/settings.config.js';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  
  app.setGlobalPrefix(settings.basePath)

  app.enableCors({
    origin: settings.corsOrigin,
    credentials: true,
  });
  
  await app.listen(settings.port, () => {
    console.log(`Servidor escuchando en http://localhost:${settings.port}${settings.basePath}`);
  });
}
bootstrap();
