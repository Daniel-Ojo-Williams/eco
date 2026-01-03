import { Injectable, Inject } from "@nestjs/common";
import { IProductRepository } from "../../domain";
import { PRODUCT_REPOSITORY } from "../../domain";
import { IInventoryRepository } from "../../domain";
import { INVENTORY_REPOSITORY } from "../../domain";

@Injectable()
export class DeleteProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepository: IInventoryRepository,
    ) {}

    async execute(productId: string) {
        await this.inventoryRepository.delete(productId);
        await this.productRepository.delete(productId);
    }
}