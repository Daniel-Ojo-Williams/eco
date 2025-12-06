import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import databaseConfig from './infrastructure/config/database.config';
import jwtConfig from './infrastructure/config/jwt.config';
import { z } from "zod";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/persistence/typeorm/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserGrpcController } from './presentation/grpc/user.controller';
import { GET_USER_USE_CASE, GetUserUseCase, LoginUserUseCase, PASSWORD_HASHER, RegisterUserUseCase, TOKEN_GENERATOR, UpdateProfileDto, UpdateProfileUseCase, VerifyEmailUseCase } from './applications';
import { USER_REPOSITORY } from './domain';
import { UserRepository } from './infrastructure/persistence/typeorm/repository/user.repository';
import { BcryptPasswordHasher } from './infrastructure/persistence/security/bcrypt-password-hasher';
import { JwtTokenGenerator } from './infrastructure/persistence/security/jwt-token-generator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      validate: (env) => {
        const zodObject = z.object({
            DB_HOST: z.string(),
            DB_PORT: z.string(),
            DB_USERNAME: z.string(),
            DB_PASSWORD: z.string(),
            DB_NAME: z.string(),
            JWT_SECRET: z.string(),
            JWT_EXPIRES_IN: z.string().default("1h"),
            JWT_REFRESH_SECRET: z.string(),
            JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
        })

        return zodObject.parse(env);
      }
    }),

    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    TypeOrmModule.forFeature([UserSchema]),

    JwtModule.registerAsync({
      global: true,
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expiresIn,
        }
      }),
      imports: [ConfigModule.forFeature(jwtConfig)],
    })
  ],
  controllers: [UserGrpcController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    GetUserUseCase,
    VerifyEmailUseCase,
    UpdateProfileUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher
    },
    {
      provide: TOKEN_GENERATOR,
      useClass: JwtTokenGenerator
    },
    {
      provide: GET_USER_USE_CASE,
      useClass: GetUserUseCase
    }
  ],
})
export class AppModule {}
