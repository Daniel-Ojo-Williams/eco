export class UserDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserDomainException";
    }
}

export class UserNotFoundException extends UserDomainException {
    constructor(id: string) {
        super(`User not found: ${id}.`);
        this.name = "UserNotFoundException";
    }
}

export class UserAlreadyExistsException extends UserDomainException {
    constructor(email: string) {
        super(`User with email ${email} already exists.`);
        this.name = "UserAlreadyExistsException";
    }
}

export class InvalidCredentialsException extends UserDomainException {
    constructor() {
        super("Invalid credentials.");
        this.name = "InvalidCredentialsException";
    }
}