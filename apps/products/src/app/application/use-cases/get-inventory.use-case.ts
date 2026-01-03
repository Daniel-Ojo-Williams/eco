import { Inject, Injectable } from "@nestjs/common";
import { INVENTORY_REPOSITORY } from "../../domain";
import { IInventoryRepository } from "../../domain";
import { InventoryNotFoundException } from "../../domain/exceptions/domain.exception";

@Injectable()
export class GetInventoryUseCase {
    constructor(
        @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepository: IInventoryRepository,
    ) {}

    async execute(productId: string) {
        const inventory = await this.inventoryRepository.findByProductId(productId);
        if (!inventory) {
            throw new InventoryNotFoundException();
        }
        return inventory;
    }
}