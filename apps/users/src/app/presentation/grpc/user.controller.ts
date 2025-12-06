import { Controller } from "@nestjs/common";
import { UserServiceControllerMethods, UserServiceController, UserResponse, LoginRequest, GetUserRequest, LoginResponse, UpdateProfileRequest, ValidateTokenRequest, ValidateTokenResponse, VerifyEmailRequest } from "@eco/grpc";
import { GetUserUseCase, LoginUserUseCase, RegisterUserUseCase, RegisterUserDto, LoginUserDto, GetUserDto, VerifyEmailUseCase, UpdateProfileUseCase } from "../../applications";
import { RpcException } from "@nestjs/microservices";
import { status } from "@grpc/grpc-js";
import { ValidatedBody } from "@eco/common";

@Controller()
@UserServiceControllerMethods()
export class UserGrpcController implements UserServiceController {
    constructor(
        private readonly registerUserUsecase: RegisterUserUseCase,
        private readonly loginUserUsecase: LoginUserUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly verifyEmailUseCase: VerifyEmailUseCase,
        private readonly updateProfileUseCase: UpdateProfileUseCase,
    ) {}

    async register(@ValidatedBody(RegisterUserDto) request: RegisterUserDto): Promise<UserResponse> {
        const response = await this.registerUserUsecase.execute(request);
        return {
            ...response,
            createdAt: response.createdAt.toISOString(),
        }
    }

    async login(@ValidatedBody(LoginUserDto) request: LoginUserDto): Promise<LoginResponse> {
        const response = await this.loginUserUsecase.execute(request);

        return {
            ...response,
            user: {
                ...response.user,
                createdAt: response.user.createdAt.toISOString(),
            },
        }
    }

    async getUser(@ValidatedBody(GetUserDto) request: GetUserDto): Promise<UserResponse> {
        const response = await this.getUserUseCase.execute(request.id);

        return {
            ...response,
            createdAt: response.createdAt.toISOString(),
        }
    }

    async updateProfile(request: UpdateProfileRequest): Promise<UserResponse> {
        const response = await this.updateProfileUseCase.execute(request.id, request);
        return {
            ...response,
            createdAt: response.createdAt.toISOString(),
        }
    }

    async verifyEmail(request: VerifyEmailRequest): Promise<UserResponse> {
        const response = await this.verifyEmailUseCase.execute(request.id);
        return {
            ...response,
            createdAt: response.createdAt.toISOString(),
        }
    }

    async validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
        throw new RpcException({
            code: status.UNIMPLEMENTED,
            message: "ValidateToken not yet implemented."
        });
    }
}
