import { IsArray, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    category: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images: string[];

    @IsObject()
    @IsOptional()
    specifications: Record<string, string>;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    initialStock: number;
}