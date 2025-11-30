/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USERS_PACKAGE_NAME } from '@eco/grpc';
import { GrpcExceptionFilter } from '@eco/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: USERS_PACKAGE_NAME,
        protoPath: join(__dirname, 'proto/users.proto'),
        url: `0.0.0.0:${process.env.USER_SERVICE_PORT || 50051}`
      },
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
  Logger.log(
    `🚀 User Service is running on port ${process.env.USER_SERVICE_PORT || 50051}`
  );
}

bootstrap();
