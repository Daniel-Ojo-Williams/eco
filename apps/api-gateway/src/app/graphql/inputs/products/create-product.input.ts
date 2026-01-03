import { InputType, Field } from "@nestjs/graphql";
import { IsNumber, IsObject, IsString, ValidatorConstraint, ValidatorConstraintInterface, Validate } from "class-validator";
import GraphQLJSON from "graphql-type-json";

@ValidatorConstraint({ name: "specificationsObjectValidation", async: false })
class SpecificationsObjectValidation implements ValidatorConstraintInterface {
    validate(specs: Record<string, string>): boolean {
        return specs && typeof specs === "object" &&
            Object.entries(specs).every(([key, value]) => typeof key === "string" && typeof value === "string");
    }

    defaultMessage(): string {
        return "All specification keys and values must be strings";
    }
}

@InputType()
export class CreateProductInput {
    @Field()
    @IsString()
    name: string;
    
    @Field()
    @IsString()
    description: string;
    
    @Field()
    @IsString()
    category: string;
    
    @Field()
    @IsNumber()
    price: number;
    
    @Field(() => [String])
    @IsString({ each: true })
    images: string[];
    
    @Field(() => GraphQLJSON)
    @IsObject()
    @Validate(SpecificationsObjectValidation)
    specifications: Record<string, string>;

    @Field()
    @IsNumber()
    initialStock: number;
}