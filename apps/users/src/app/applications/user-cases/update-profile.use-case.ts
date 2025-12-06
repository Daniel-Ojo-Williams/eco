import { Injectable } from "@nestjs/common";
import { IUserRepository, USER_REPOSITORY, UserNotFoundException } from "../../domain";

import { Inject } from "@nestjs/common";
import { UpdateProfileRequest } from "@eco/grpc";
import { UserResponseDto } from "../dto";

@Injectable()
export class UpdateProfileUseCase {
    constructor (@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

    async execute(id: string, data: UpdateProfileRequest): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) throw new UserNotFoundException(id);

        user.updateProfile(data);
        await this.userRepository.update(user);

        return UserResponseDto.fromDomain(user);
    }
}