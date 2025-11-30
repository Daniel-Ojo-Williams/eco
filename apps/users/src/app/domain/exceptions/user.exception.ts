import { DomainException } from "@eco/common";
import { status } from "@grpc/grpc-js";

export abstract class UserDomainException extends DomainException {
    readonly domainName = "User Domain";
}

export class UserNotFoundException extends UserDomainException {
    statusCode = status.NOT_FOUND;
    constructor(id: string) {
        super(`User not found: ${id}.`);
    }
}

export class UserAlreadyExistsException extends UserDomainException {
    statusCode = status.ALREADY_EXISTS
    constructor(email: string) {
        super(`User with email ${email} already exists.`);
    }
}

export class InvalidCredentialsException extends UserDomainException {
    statusCode = status.UNAUTHENTICATED;
    constructor() {
        super("Invalid credentials.",);
    }
}

export class AccountDeactivateException extends UserDomainException {
    statusCode =  status.PERMISSION_DENIED;
    constructor() {
        super("Your account has been deactivated. Please contact support.");
    }
}

export class EmailNotVerifiedException  extends UserDomainException {
    statusCode =  status.PERMISSION_DENIED;
    constructor() {
        super("Your email has not been verified. Please check your email for verification.");
    }
}