import { ID, Args, Query, Resolver, Mutation, Int } from "@nestjs/graphql";
import { ProductsGrpcClient } from "../../clients/products/products-grpc.client";

import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Inventory, Product, ProductList } from "../types/product";
import { CreateProductInput } from "../inputs/products/create-product.input";
import { ListProductInput } from "../inputs/products/list-product.input";

@Resolver()
export class ProductResolver {
    constructor(private readonly productGrpcClient: ProductsGrpcClient) {}

    @Query(() => ProductList)
    async listProducts(@Args("listProductInput") listProductInput: ListProductInput): Promise<ProductList> {
        const response = await this.productGrpcClient.listProducts(listProductInput);
        return {
            items: response.products,
            total: response.total,
            page: response.page,
            limit: response.limit
        };
    }

    @Mutation(() => Product)
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Args("createProductInput") createProductInput: CreateProductInput
    ): Promise<Product> {
        return await this.productGrpcClient.createProduct(createProductInput);
    }

    @Query(() => Product)
    async getProduct(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<Product> {
        return await this.productGrpcClient.getProduct(id);
    }

    @Mutation(() => Product)
    @UseGuards(JwtAuthGuard)
    async publishProduct(@Args("id", { type: () => ID }, ParseUUIDPipe) id: string): Promise<Product> {
        return await this.productGrpcClient.publishProduct(id);
    }

    @Mutation(() => Product)
    @UseGuards(JwtAuthGuard)
    async updateProduct(
        @Args('id', { type: () => ID }, ParseUUIDPipe) id: string, 
        @Args('input') input: CreateProductInput
    ): Promise<Product> {
        return await this.productGrpcClient.updateProduct({ id, ...input });
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteProduct(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<boolean> {
        await this.productGrpcClient.deleteProduct(id);
        return true;
    }

    @Query(() => Inventory)
    async getInventory(@Args('productId', { type: () => ID }, ParseUUIDPipe) productId: string): Promise<Inventory> {
        const response = await this.productGrpcClient.getInventory({ productId });
        return {
            availableQuantity: response.availableQuantity,
            reservedQuantity: response.reservedQuantity,
            totalQuantity: response.totalQuantity,
            updatedAt: response.updatedAt
        };
    }

    @Mutation(() => Inventory)
    @UseGuards(JwtAuthGuard)
    async reserveStock(@Args('productId', { type: () => ID }, ParseUUIDPipe) productId: string, @Args('quantity', { type: () => Int }) quantity: number): Promise<Inventory> {
        const response = await this.productGrpcClient.reserveStock({ productId, quantity });
        return {
            availableQuantity: response.availableQuantity,
            reservedQuantity: response.reservedQuantity,
            totalQuantity: response.totalQuantity,
            updatedAt: response.updatedAt
        };
    }
    
    @Mutation(() => Inventory)
    @UseGuards(JwtAuthGuard)
    async releaseStock(
        @Args('productId', { type: () => ID }, ParseUUIDPipe) productId: string, @Args('quantity', { type: () => Int }) quantity: number): Promise<Inventory> {
        const response = await this.productGrpcClient.releaseStock({ productId, quantity });

        return {
            availableQuantity: response.availableQuantity,
            reservedQuantity: response.reservedQuantity,
            totalQuantity: response.totalQuantity,
            updatedAt: response.updatedAt
        };
    }

    @Mutation(() => Inventory)
    @UseGuards(JwtAuthGuard)
    async restock(
        @Args('productId', { type: () => ID }, ParseUUIDPipe) productId: string,
        @Args('quantity', { type: () => Int }) quantity: number
    ): Promise<Inventory> {
        const response = await this.productGrpcClient.restockInventory({ productId, quantity });
        return {
            availableQuantity: response.availableQuantity,
            reservedQuantity: response.reservedQuantity,
            totalQuantity: response.totalQuantity,
            updatedAt: response.updatedAt
        };
    }
    
}