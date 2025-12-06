import { USER_SERVICE_NAME, USERS_PACKAGE_NAME } from "@eco/grpc";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { UsersGrpcClient } from "./users-grpc.client";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: USER_SERVICE_NAME,
                useFactory: (config: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: USERS_PACKAGE_NAME,
                        protoPath: join(__dirname, '/proto/users.proto'),
                        url: `0.0.0.0:${config.get('USER_SERVICE_PORT')}`
                    }
                }),
                inject: [ConfigService]
            }
        ])
    ],
    providers: [UsersGrpcClient],
    exports: [UsersGrpcClient]
})
export class UsersGrpcModule {}