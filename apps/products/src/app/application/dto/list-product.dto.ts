import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ListProductDto {
    @IsNumber()
    @IsOptional()
    @Min(1)
    page: number;

    @IsNumber()
    @IsOptional()
    @Min(10)
    limit: number;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    search: string;
}