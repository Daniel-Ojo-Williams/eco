import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
export class GqlError {
    @Field()
    message: string;

    @Field()
    code: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    details?: object;
}

@ObjectType()
export class GqlResponse {
    @Field(() => GqlError, { nullable: true })
    error?: GqlError;

    @Field()
    success: boolean;
}