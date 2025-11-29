import { User } from "../entities";

export interface IUserRepository {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    findAll(): Promise<User[]>;
    delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = "USER_REPOSITORY";
