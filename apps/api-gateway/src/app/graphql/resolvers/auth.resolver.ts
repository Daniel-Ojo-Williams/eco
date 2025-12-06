import {  Args, Mutation, Resolver } from "@nestjs/graphql";
import { UsersGrpcClient } from "../../clients/users/users-grpc.client";
import { RegisterInput } from "../inputs/users/register.input";
import { AuthPayload } from "../types/auth";
import { LoginInput } from "../inputs/users/login.input";

@Resolver()
export class AuthResolver {
    constructor(private readonly userGrpcClient: UsersGrpcClient) {}

    @Mutation(() => AuthPayload)
    async register(@Args("registerInput") args: RegisterInput): Promise<AuthPayload> {
            await this.userGrpcClient.register(args);
            const response = await this.userGrpcClient.login({
                email: args.email,
                password: args.password,
            });
    
            return response;
    }

    @Mutation(() => AuthPayload)
    async login(@Args("loginInput") args: LoginInput): Promise<AuthPayload> {
            return await this.userGrpcClient.login(args);
    }
}

    