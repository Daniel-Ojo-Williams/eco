import { Injectable } from "@nestjs/common";
import { IPasswordHasher } from "../../../applications";
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds = 10;

    hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}