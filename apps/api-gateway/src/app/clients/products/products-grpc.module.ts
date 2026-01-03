import { products } from "@eco/grpc";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { ProductsGrpcClient } from "./products-grpc.client";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: products.PRODUCT_SERVICE_NAME,
                useFactory: (config: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: products.PRODUCT_PACKAGE_NAME,
                        protoPath: join(__dirname, '/proto/products.proto'),
                        url: `0.0.0.0:${config.get('PRODUCT_SERVICE_PORT')}`
                    }
                }),
                inject: [ConfigService]
            }
        ])
    ],
    providers: [ProductsGrpcClient],
    exports: [ProductsGrpcClient]
})
export class ProductsGrpcModule {}