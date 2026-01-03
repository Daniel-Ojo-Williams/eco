import { Field, ID, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class Product {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    price: number;

    @Field()
    createdAt: string;

    @Field()
    status: string;
    
    @Field(() => [String])
    images: string[];

    @Field(() => GraphQLJSON)
    specifications: Record<string, string>;

    @Field()
    category: string;

    @Field()
    updatedAt: string;
}

@ObjectType()
export class ProductList {
    @Field(() => [Product])
    items: Product[];
    
    @Field()
    total: number;
    
    @Field()
    page: number;
    
    @Field()
    limit: number;
}

@ObjectType()
export class Inventory {
    @Field()
    availableQuantity: number;
    
    @Field()
    reservedQuantity: number;
    
    @Field()
    totalQuantity: number;
    
    @Field()
    updatedAt: string;
}

