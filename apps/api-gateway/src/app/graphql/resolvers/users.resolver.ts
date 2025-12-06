import { ID, Args, Query, Resolver, Mutation } from "@nestjs/graphql";
import { UsersGrpcClient } from "../../clients/users/users-grpc.client";

import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UpdateUserInput } from "../inputs/users/update-user.input";
import { User } from "../types/user";

@Resolver()
export class UserResolver {
    constructor(private readonly userGrpcClient: UsersGrpcClient) {}
    @UseGuards(JwtAuthGuard)
    @Query(() => User)
    async me(@CurrentUser("userId") id: string): Promise<User> {
        return await this.userGrpcClient.getUser(id);
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async user(@Args("id", { type: () => ID }) id: string): Promise<User> {
        return await this.userGrpcClient.getUser(id);
    }

    @Mutation(() => User)
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @CurrentUser("userId") id: string,
        @Args("updateUserInput") updateUserInput: UpdateUserInput
    ): Promise<User> {
        return await this.userGrpcClient.updateProfile({ id, ...updateUserInput });
    }
}

    