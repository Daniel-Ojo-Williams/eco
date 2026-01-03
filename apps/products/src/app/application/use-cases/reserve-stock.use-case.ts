import { Inject, Injectable } from "@nestjs/common";
import { INVENTORY_REPOSITORY, IInventoryRepository, PRODUCT_REPOSITORY, IProductRepository } from "../../domain";
import { ReserveInventoryDto } from "../dto/reserve-inventory.dto";
import { ProductNotFoundException } from "../../domain/exceptions/domain.exception";

@Injectable()
export class ReserveStockUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepository: IInventoryRepository
    ) {}

    async execute(productId: string, dto: ReserveInventoryDto) {        
        const product = await this.productRepository.findById(productId);
        if (!product) throw new ProductNotFoundException(productId);
        const inventory = await this.inventoryRepository.executeInTransaction(
            productId,
            (inventory) => {
                inventory.reserve(dto.quantity)
                return inventory;
            }
        )

        return inventory
    }
}