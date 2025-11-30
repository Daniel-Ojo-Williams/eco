import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError"
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassType<T = any> =  new (...args: unknown[]) => T

export const ValidatedBody = createParamDecorator(
    async (dtoClass: ClassType, ctx: ExecutionContext) => {
        const rpcContext = ctx.switchToRpc();
        const data = rpcContext.getData();

        const object = plainToInstance(dtoClass, data);
        const errors = await validate(object);

        if (errors.length > 0) {
            const message = `Validation failed: ${errors.map((e) => e.constraints && Object.values(e.constraints).join(", "))}`
            throw new ValidationError(message)
        }

        return object;
    }
)