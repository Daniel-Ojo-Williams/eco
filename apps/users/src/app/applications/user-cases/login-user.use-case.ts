import { Inject, Injectable } from "@nestjs/common";
import { AccountDeactivateException, EmailNotVerifiedException, InvalidCredentialsException, IUserRepository, USER_REPOSITORY } from "../../domain";
import { IPasswordHasher, ITokenGenerator, PASSWORD_HASHER, TOKEN_GENERATOR } from "../ports";
import { LoginResponseDto, LoginUserDto, UserResponseDto } from "../dto";

@Injectable()
export class LoginUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
        @Inject(TOKEN_GENERATOR) private readonly tokenGenerator: ITokenGenerator,
    ) {}

    async execute(dto: LoginUserDto): Promise<LoginResponseDto> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) throw new InvalidCredentialsException();

        const passwordMatch = await this.passwordHasher.compare(dto.password, user.getPasswordHash());

        if (!passwordMatch) throw new InvalidCredentialsException();

        if (!user.getIsActive()) throw new AccountDeactivateException();

        const tokens = await this.tokenGenerator.generateTokenPair({ email: user.getEmail(), roles: user.getRoles(), userId: user.id })

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: UserResponseDto.fromDomain(user)
        };
    }
}