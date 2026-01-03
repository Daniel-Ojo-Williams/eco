import { Inject, Injectable } from "@nestjs/common";
import { INVENTORY_REPOSITORY, IInventoryRepository, PRODUCT_REPOSITORY, IProductRepository } from "../../domain";
import { ReserveInventoryDto } from "../dto/reserve-inventory.dto";
import { ProductNotFoundException } from "../../domain/exceptions/domain.exception";

@Injectable()
export class ReleaseStockUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepository: IInventoryRepository
    ) {}

    async execute(productId: string, dto: ReserveInventoryDto) {
        const product = await this.productRepository.findById(productId);
        if (!product) throw new ProductNotFoundException(productId);
        return await this.inventoryRepository.executeInTransaction(
            productId,
            (inventory) => {
                inventory.release(dto.quantity)
                return inventory;
            }
        )
    }
}