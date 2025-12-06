import { LoginRequest, LoginResponse, RegisterRequest, UpdateProfileRequest, UserResponse, UserServiceClient } from "@eco/grpc";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { USER_SERVICE_NAME } from "@eco/grpc";
import { ClientGrpc } from "@nestjs/microservices";
import { grpcWrapper } from "../../helpers";

@Injectable()
export class UsersGrpcClient implements OnModuleInit {
    constructor(@Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc) {}
    private usersService: UserServiceClient;

    onModuleInit() {
        this.usersService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    async register(data: RegisterRequest): Promise<UserResponse> {
        return grpcWrapper(() => this.usersService.register(data));
    }

    async login(data: LoginRequest): Promise<LoginResponse> {
        return grpcWrapper(() => this.usersService.login(data));
    }

    async getUser(id: string): Promise<UserResponse> {
        return grpcWrapper(() => this.usersService.getUser({id}));
    }

    async verifyEmail(id: string): Promise<UserResponse> {
        return grpcWrapper(() => this.usersService.verifyEmail({id}));
    }

    async updateProfile(data: UpdateProfileRequest): Promise<UserResponse> {
        return grpcWrapper(() => this.usersService.updateProfile(data));
    }
}