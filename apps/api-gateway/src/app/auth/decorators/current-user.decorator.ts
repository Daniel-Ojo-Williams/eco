import { createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GqlContext } from "../types/gql-context.type";
import { TokenPayload } from "@eco/common";

export const CurrentUser = createParamDecorator((data: keyof TokenPayload, context) => {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    if (data) {
        return ctx.user[data];
    }
    return ctx.user;
})