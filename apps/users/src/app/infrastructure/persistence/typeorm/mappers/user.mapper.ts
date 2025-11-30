import { User, UserRole } from "../../../../domain";
import { UserSchema } from "../schemas/user.schema";

export class UserMapper {
    static toDomain(schema: UserSchema): User {
        const roles = schema.roles.map(role => role as UserRole);

        return User.reconstitute({
            id: schema.id,
            firstName: schema.firstName,
            lastName: schema.lastName,
            email: schema.email,
            roles,
            isActive: schema.isActive,
            isEmailVerified: schema.isEmailVerified,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
            passwordHash: schema.passwordHash
        })
    }

    static toSchema(user: User): UserSchema {
        const userSchema = new UserSchema();
        userSchema.id = user.id;
        userSchema.firstName = user.getFirstName();
        userSchema.lastName = user.getLastName();
        userSchema.email = user.getEmail();
        userSchema.roles = user.getRoles();
        userSchema.isActive = user.getIsActive();
        userSchema.isEmailVerified = user.getIsEmailVerified();
        userSchema.createdAt = user.getCreatedAt();
        userSchema.updatedAt = user.getUpdatedAt();
        userSchema.passwordHash = user.getPasswordHash();
        return userSchema;
    }
}