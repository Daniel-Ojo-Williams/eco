import { Inject, Injectable } from "@nestjs/common";
import { GET_USER_USE_CASE, IGetUserUseCase, ITokenGenerator, TokenPair } from "../../../applications";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../../config/jwt.config";
import { TokenPayload } from "@eco/common";

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
    constructor (
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY) private readonly tokenConfig: ConfigType<typeof jwtConfig>,
        @Inject(GET_USER_USE_CASE) private readonly getUserByIdUseCase: IGetUserUseCase
    ) {}

    async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.tokenConfig.secret,
            expiresIn: this.tokenConfig.expiresIn as JwtSignOptions["expiresIn"],
        });
        const refreshToken = await this.jwtService.signAsync({ userId: payload.userId }, {
            secret: this.tokenConfig.refreshSecret,
            expiresIn: this.tokenConfig.refreshExpiresIn as JwtSignOptions["expiresIn"],
        });
        return { accessToken, refreshToken };
    }

    async verifyToken(token: string): Promise<TokenPayload | null> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.tokenConfig.secret,
            });
            return payload;
        } catch {
            return null;
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<string | null> {
        try {
            const payload = await this.jwtService.verifyAsync<{ userId: string }>(refreshToken, {
                secret: this.tokenConfig.refreshSecret,
            })

            const user = await this.getUserByIdUseCase.execute(payload.userId);

            const accessToken = await this.jwtService.signAsync<TokenPayload>({ userId: user.id, email: user.email, roles: user.roles }, {
                secret: this.tokenConfig.secret,
                expiresIn: this.tokenConfig.expiresIn as JwtSignOptions["expiresIn"],
            })
            return accessToken;
        } catch {
            return null;
        }
    }
}