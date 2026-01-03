import { Inject, Injectable } from "@nestjs/common";
import { INVENTORY_REPOSITORY } from "../../domain";
import { IInventoryRepository } from "../../domain";
import { UpdateInventoryDto } from "../dto/update-inventory.dto";
import { InventoryNotFoundException } from "../../domain/exceptions/domain.exception";

@Injectable()
export class RestockInventoryUseCase {
    constructor(
        @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepository: IInventoryRepository,
    ) {}

    async execute(productId: string, dto: UpdateInventoryDto) {
        const inventory = await this.inventoryRepository.findByProductId(productId);
        if (!inventory) {
            throw new InventoryNotFoundException();
        }
        inventory.restock(dto.quantity);
        await this.inventoryRepository.save(inventory);
        return inventory;
    }
}