import { User } from "../../domain";

export class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isActive: boolean;
    fullName: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;

    static fromDomain(user: User): UserResponseDto {
        const userResponseDto = new UserResponseDto();
        userResponseDto.id = user.id;
        userResponseDto.email = user.getEmail();
        userResponseDto.firstName = user.getFirstName();
        userResponseDto.lastName = user.getLastName();
        userResponseDto.fullName = user.getFullName();
        userResponseDto.roles = user.getRoles();
        userResponseDto.isActive = user.getIsActive();
        userResponseDto.isEmailVerified = user.getIsEmailVerified();
        userResponseDto.createdAt = user.getCreatedAt();
        userResponseDto.updatedAt = user.getUpdatedAt();
        return userResponseDto;
    }
}