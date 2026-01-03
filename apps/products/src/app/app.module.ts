import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import productDBConfig from './infrastructure/config/mongodb.config';
import inventoryDBConfig from './infrastructure/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSchema, PRODUCT_COLLECTION_NAME } from './infrastructure/persistence/mongodb/schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InventorySchema } from './infrastructure/persistence/typeorm/schemas/inventory.schema';
import { ProductsGrpcController } from './presentation/products.controller';
import { PRODUCT_REPOSITORY } from './domain';
import { ProductRepository } from './infrastructure/persistence/mongodb/product.repository';
import { INVENTORY_REPOSITORY } from './domain';
import { InventoryRepository } from './infrastructure/persistence/typeorm/repository/inventory.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { GetInventoryUseCase } from './application/use-cases/get-inventory.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { PublishProductUseCase } from './application/use-cases/publish-product.use-case';
import { ReserveStockUseCase } from './application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from './application/use-cases/release-stock.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { RestockInventoryUseCase } from './application/use-cases/restock-inventory.use-case';
import { z } from "zod";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [productDBConfig, inventoryDBConfig],
      validate: (env) => {
        const zodObject = z.object({
          MONGO_URI: z.string(),
          DB_PORT: z.string().transform((arg) => parseInt(arg)),
          DB_USERNAME: z.string(),
          DB_PASSWORD: z.string(),
          DB_NAME: z.string(),
          DB_HOST: z.string(),
        })

        return zodObject.parse(env);
      }
    }),
    TypeOrmModule.forRootAsync(inventoryDBConfig.asProvider()),
    TypeOrmModule.forFeature([InventorySchema]),
    MongooseModule.forRootAsync(productDBConfig.asProvider()),
    MongooseModule.forFeature([{ name: PRODUCT_COLLECTION_NAME, schema: ProductSchema }]),
  ],
  controllers: [ProductsGrpcController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    {
      provide: INVENTORY_REPOSITORY,
      useClass: InventoryRepository,
    },
    CreateProductUseCase,
    DeleteProductUseCase,
    GetInventoryUseCase,
    GetProductUseCase,
    ListProductsUseCase,
    PublishProductUseCase,
    ReserveStockUseCase,
    ReleaseStockUseCase,
    UpdateProductUseCase,
    RestockInventoryUseCase,
  ],
})
export class AppModule {}
