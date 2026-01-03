/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { products } from '@eco/grpc';
import { GrpcExceptionFilter } from '@eco/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: products.PRODUCT_PACKAGE_NAME,
        protoPath: join(__dirname, 'proto/products.proto'),
        url: `0.0.0.0:${process.env.PRODUCT_SERVICE_PORT || 50052}`
      }
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
    `🚀 Application is running on: http://localhost:${process.env.PRODUCT_SERVICE_PORT || 50052}`
  );
}

bootstrap();
