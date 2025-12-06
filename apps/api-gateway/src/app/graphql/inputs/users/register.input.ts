import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

@InputType()
export class RegisterInput {
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword(
        { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1},
        { message: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol" }
    )
    password: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    firstName: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    lastName: string;
}