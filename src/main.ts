import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupMiddlewares from './setup-middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupMiddlewares(app);
  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get('EXPRESS_PORT'));
}
bootstrap();
