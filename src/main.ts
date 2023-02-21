import { ValidationPipe, VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
    defaultVersion: VERSION_NEUTRAL,
  });
  await app.listen(3000);
}
bootstrap();
