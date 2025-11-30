import { registerAs } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN as JwtSignOptions["expiresIn"],
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
}))
