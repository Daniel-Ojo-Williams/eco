import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from "zod";
import { EcoGraphQLModule } from './graphql/graphql.module';

@Module({
  imports: [
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
    EcoGraphQLModule,
  ],
})
export class AppModule {}
