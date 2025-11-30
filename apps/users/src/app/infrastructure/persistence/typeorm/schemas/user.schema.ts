import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserSchema {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @Column({ unique: true })
    email: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ name: "password_hash" })
    passwordHash: string;

    @Column({ name: "is_email_verified", default: false })
    isEmailVerified: boolean;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @Column({ type: "simple-array" })
    roles: string[];

    @CreateDateColumn({ name: "created_at", type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
    updatedAt: Date;
}
