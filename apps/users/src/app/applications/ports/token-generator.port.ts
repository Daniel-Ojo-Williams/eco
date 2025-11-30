export interface TokenPayload {
    userId: string;
    email: string;
    roles: string[];
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface ITokenGenerator {
    generateTokenPair(payload: TokenPayload): Promise<TokenPair>;
    verifyToken(token: string): Promise<TokenPayload | null>;
    refreshAccessToken(refreshToken: string): Promise<string | null>;
}

export const TOKEN_GENERATOR = "TOKEN_GENERATOR";