import { Inventory } from "../entities/inventory.entity";

export interface IInventoryRepository {
    save(inventory: Inventory): Promise<void>;
    findByProductId(productId: string): Promise<Inventory | null>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
}

export const INVENTORY_REPOSITORY = "INVENTORY_REPOSITORY";