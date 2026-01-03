import { Inventory } from "../entities/inventory.entity";

export interface IInventoryRepository {
    save(inventory: Inventory): Promise<void>;
    findByProductId(productId: string): Promise<Inventory | null>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    findByProductIdForUpdate(id: string): Promise<Inventory | null>;
    executeInTransaction<T>(id: string, operation: (inventory: Inventory) => T): Promise<T>
}

export const INVENTORY_REPOSITORY = "INVENTORY_REPOSITORY";