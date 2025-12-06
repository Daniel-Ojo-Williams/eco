import { status } from "@grpc/grpc-js";
import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";

export interface GrpcError {
    code: number;
    details?: string;
    message?: string;
    metadata?: unknown;
}

export function handleGrpcError(error: GrpcError): never {
    const message = error.details || error.message || "An error occurred";

    switch (error.code) {
        case status.NOT_FOUND:
            throw new NotFoundException(message);

        case status.INVALID_ARGUMENT:
            throw new BadRequestException(message);

        case status.ALREADY_EXISTS:
            throw new ConflictException(message);

        case status.PERMISSION_DENIED:
            throw new ForbiddenException(message);

        case status.UNAUTHENTICATED:
            throw new UnauthorizedException(message);

        case status.UNAVAILABLE:
        case status.DEADLINE_EXCEEDED:
            throw new ServiceUnavailableException(
                "Service temporarily unavailable. Please try again later."
            );

        case status.FAILED_PRECONDITION:
            throw new BadRequestException(message);

        case status.INTERNAL:
        case status.UNKNOWN:
        default:
            throw new InternalServerErrorException(message);
    }
}