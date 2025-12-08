import { Module } from "@nestjs/common";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/users.resolver";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { AuthModule } from "../auth/auth.module";
import { UsersGrpcModule } from "../clients/users/users-grpc.module";

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
        AuthModule,
        UsersGrpcModule
    ],
    providers: [
        AuthResolver,
        UserResolver
    ]
})
export class EcoGraphQLModule {}