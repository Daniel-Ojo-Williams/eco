import { Injectable } from "@nestjs/common";
import { IUserRepository, User } from "../../../../domain";
import { Repository } from "typeorm";
import { UserSchema } from "../schemas/user.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserSchema) private readonly ormRepository: Repository<UserSchema>,
    ) {}

    async save(user: User): Promise<void> {
        const schema = UserMapper.toSchema(user);
        await this.ormRepository.save(schema);
    }

    async update(user: User): Promise<void> {
        const schema = UserMapper.toSchema(user);
        await this.ormRepository.update(schema.id, schema);
    }

    async findByEmail(email: string): Promise<User | null> {
        const schema = await this.ormRepository.findOneBy({ email });
        if (!schema) return null;
        return UserMapper.toDomain(schema);
    }

    async findById(id: string): Promise<User | null> {
        const schema = await this.ormRepository.findOneBy({ id });
        if (!schema) return null;
        return UserMapper.toDomain(schema);
    }

    async findAll(): Promise<User[]> {
        const users = await this.ormRepository.find({
            order: {
                createdAt: "DESC"
            }
        });
        return users.map(UserMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }

    async existsByEmail(email: string): Promise<boolean> {
        const exists = await this.ormRepository.exists({ where: { email } });
        return exists;
    }
}
