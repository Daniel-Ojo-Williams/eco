import { UserResponseDto } from "../dto";

export interface IGetUserUseCase {
    execute(id: string): Promise<UserResponseDto>
}

export const GET_USER_USE_CASE = 'GET_USER_USE_CASE';