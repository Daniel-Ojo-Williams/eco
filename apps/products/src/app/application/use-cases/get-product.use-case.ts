import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY, IProductRepository, INVENTORY_REPOSITORY, IInventoryRepository, Product, Inventory } from "../../domain";
import { ProductNotFoundException } from "../../domain/exceptions/domain.exception";

@Injectable()
export class GetProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepository: IInventoryRepository
    ) {}

    async execute(id: string): Promise<{ product: Product; inventory: Inventory }> {
        const product = await this.productRepository.findById(id);

        if (!product) throw new ProductNotFoundException(id);

        const inventory = await this.inventoryRepository.findByProductId(product.getId());

        return { product, inventory }
    }
}