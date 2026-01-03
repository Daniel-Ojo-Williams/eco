import { Module } from "@nestjs/common";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/users.resolver";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { AuthModule } from "../auth/auth.module";
import { UsersGrpcModule } from "../clients/users/users-grpc.module";
import { ProductsGrpcModule } from "../clients/products/products-grpc.module";
import { ProductResolver } from "./resolvers/products.resolver";
import GraphQLJSON from "graphql-type-json";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(__dirname, '/graphql/schema.gql'),
            playground: false,
            resolvers: { JSON: GraphQLJSON },
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
        UsersGrpcModule,
        ProductsGrpcModule,
    ],
    providers: [
        AuthResolver,
        UserResolver,
        ProductResolver
    ]
})
export class EcoGraphQLModule {}