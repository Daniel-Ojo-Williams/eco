import { Email, UserRole, UserRoles } from "../value-objects";
import * as crypto from "node:crypto";

type NewUserPayload = {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
}

type ReconstituteUserPayload = {
    id: string;
    roles: UserRole[];
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
} & NewUserPayload;

type UserProps = { id: string; firstName: string; lastName: string; email: Email; passwordHash: string; roles: UserRoles; isActive: boolean; isEmailVerified: boolean; createdAt: Date; updatedAt: Date; }

export class User {
    public readonly id: string;
    private firstName: string;
    private lastName: string;
    private email: Email;
    private passwordHash: string;
    private roles: UserRoles;
    private isActive: boolean;
    private isEmailVerified: boolean;
    public readonly createdAt: Date;
    private updatedAt: Date;

    private constructor(payload: UserProps) {
        this.id = payload.id;
        this.firstName = payload.firstName;
        this.lastName = payload.lastName;
        this.email = payload.email;
        this.passwordHash = payload.passwordHash;
        this.roles = payload.roles;
        this.isActive = payload.isActive;
        this.isEmailVerified = payload.isEmailVerified;
        this.createdAt = payload.createdAt;
        this.updatedAt = payload.updatedAt;
    }

    static create(payload: NewUserPayload) {
        return new User({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: Email.create(payload.email),
            passwordHash: payload.passwordHash,
            roles: UserRoles.create([UserRole.CUSTOMER]),
            isActive: true,
            isEmailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            id: crypto.randomUUID(),
        })
    }

    static reconstitute(payload: ReconstituteUserPayload) {
        return new User({
            id: payload.id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: Email.create(payload.email),
            passwordHash: payload.passwordHash,
            roles: UserRoles.create(payload.roles),
            isActive: payload.isActive,
            isEmailVerified: payload.isEmailVerified,
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
        })
    }

    verifyEmail() {
        if (this.isEmailVerified) throw new Error('Email already verified.');
        this.isEmailVerified = true;
        this.updatedAt = new Date();
    }

    deactivate() {
        if (!this.isActive) throw new Error('User already deactivated.');
        this.isActive = false;
        this.updatedAt = new Date();
    }

    activate() {
        if (this.isActive) return;
        this.isActive = true;
        this.updatedAt = new Date();
    }

    updateProfile(payload: Partial<{ firstName: string, lastName: string }>) {
        const { firstName, lastName } = payload;
        if (!firstName?.trim() && !lastName?.trim()) throw new Error('No fields to update.');
        if (firstName) this.firstName = firstName.trim();
        if (lastName) this.lastName = lastName.trim();
        this.updatedAt = new Date();
    }

    addRole(role: UserRole) {
        this.roles = this.roles.addRole(role);
        this.updatedAt = new Date();
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    getEmail() {
        return this.email.getValue();
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getIsActive() {
        return this.isActive;
    }

    getPasswordHash() {
        return this.passwordHash;
    }

    getIsEmailVerified() {
        return this.isEmailVerified;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    getRoles() {
        return this.roles.getRoles();
    }

    hasRole(role: UserRole) {
        return this.roles.hasRole(role);
    }
}