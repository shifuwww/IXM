import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { RT_AUTH_COOKIE_NAME } from './common/const/auth';
import { RedisClientService } from './core/redis-client/redis-client.service';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORT;
  const host = configService.get<string>('HOST') || DEFAULT_HOST;

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const packageJson: { version: string; name: string; description: string } =
    JSON.parse(readFileSync('./package.json').toString());
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth()
    .addCookieAuth(RT_AUTH_COOKIE_NAME, { type: 'apiKey', in: 'cookie' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  const redisService = app.get(RedisClientService);
  await redisService.getClient();

  await app.listen(port, host, () =>
    Logger.log(
      `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`,
    ),
  );
}
bootstrap();
