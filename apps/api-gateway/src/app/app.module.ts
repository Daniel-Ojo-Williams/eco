import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { z } from "zod";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersGrpcModule } from './clients/users/users-grpc.module';
import { AuthResolver } from './graphql/resolvers/auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UserResolver } from './graphql/resolvers/users.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, '/graphql/schema.gql'),
      playground: false,
      context: (({ req, res }) => ({ req, res })),
      formatError: (error) => {
          return {
            message: error.message,
            code: error.extensions?.code,
            timestamp: error.extensions?.timestamp
          }
      }
    }),
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
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const envObject = z.object({
          PORT: z.string().transform((value) => parseInt(value)),
          USER_SERVICE_PORT: z.string().transform((value) => parseInt(value)),
        })
        return envObject.parse(env);
      }
    }),
    UsersGrpcModule,
  ],
  providers: [
    AuthResolver,
    UserResolver
  ],
})
export class AppModule {}
