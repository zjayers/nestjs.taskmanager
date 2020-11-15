import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { port } = config.get('server');
  const PORT = process.env.PORT || port;

  await app.listen(PORT);
  logger.log(`Application listenin on port ${PORT}`);
}

bootstrap();
