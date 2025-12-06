import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./user";

@ObjectType()
export class AuthPayload {
    @Field({ nullable: true })
    accessToken: string;

    @Field({ nullable: true })
    refreshToken: string;

    @Field(() => User, { nullable: true })
    user: User;
}