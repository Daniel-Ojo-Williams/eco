import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UserResponseDto } from "./user-response.dto";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
}