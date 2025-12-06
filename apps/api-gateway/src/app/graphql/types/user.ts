import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    createdAt: string;

    @Field()
    isActive: boolean;
    
    @Field()
    isEmailVerified: boolean;

    @Field()
    fullName: string;

    @Field(() => [String])
    roles: string[];
}
