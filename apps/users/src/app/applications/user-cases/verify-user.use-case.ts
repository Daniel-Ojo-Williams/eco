import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository, USER_REPOSITORY, UserNotFoundException } from "../../domain";
import { UserResponseDto } from "../dto";

@Injectable()
export class VerifyEmailUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository
    ) {}

    async execute(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) throw new UserNotFoundException(id);
        user.verifyEmail();
        await this.userRepository.update(user);
        return UserResponseDto.fromDomain(user);
    }
}