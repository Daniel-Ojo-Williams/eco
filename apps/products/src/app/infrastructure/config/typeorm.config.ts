import { registerAs } from "@nestjs/config";
import * as Schemas from "../persistence/typeorm/schemas";

export default registerAs("pg", () => ({
    type: 'postgres' as const,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    migrations: ["dist/infrastructure/persistence/typeorm/migrations/*.js"],
    entities: Object.values(Schemas),
    synchronize: true
}))