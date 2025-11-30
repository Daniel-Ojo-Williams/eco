import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository, User, USER_REPOSITORY, UserAlreadyExistsException } from "../../domain";
import { IPasswordHasher, PASSWORD_HASHER } from "../ports";
import { RegisterUserDto, UserResponseDto } from "../dto";

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher
    ) {}

    async execute(dto: RegisterUserDto): Promise<UserResponseDto> {
        const userExists = await this.userRepository.existsByEmail(dto.email);

        if (userExists) throw new UserAlreadyExistsException(dto.email);

        const passwordHash = await this.passwordHasher.hash(dto.password);
        const user = User.create({
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            passwordHash
        });
        await this.userRepository.save(user);
        return UserResponseDto.fromDomain(user);
    }
}