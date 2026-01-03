import { InputType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class ListProductInput {
    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    page: number;
    
    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    limit: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    category: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    search: string;
}