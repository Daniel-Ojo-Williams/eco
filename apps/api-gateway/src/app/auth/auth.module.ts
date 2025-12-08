import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            useFactory: (config: ConfigService) => ({
            secret: config.getOrThrow("JWT_SECRET"),
            signOptions: {
                expiresIn: "1h"
            }
            }),
            inject: [ConfigService]
        }),
    ],
})
export class AuthModule {}
