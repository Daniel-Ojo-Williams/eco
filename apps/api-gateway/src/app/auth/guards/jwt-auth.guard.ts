import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GqlContext } from "../types/gql-context.type";
import { TokenPayload } from "@eco/common";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
        const request = ctx.req;
        const token = request.headers.authorization?.split(" ")[1];

        if (!token) return false;

        try {
            const payload = this.jwtService.verify<TokenPayload>(token);

            ctx.user = payload;
            return true;
        } catch {
            return false;
        }
    }
}