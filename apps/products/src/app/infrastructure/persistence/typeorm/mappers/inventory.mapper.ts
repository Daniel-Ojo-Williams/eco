import { Inventory } from "../../../../domain";
import { InventorySchema } from "../schemas";

export class InventoryMapper {
    static toSchema(inventory: Inventory): InventorySchema {
        const schema = new InventorySchema();
        schema.productId = inventory.getProductId();
        schema.availableQuantity = inventory.getAvailableQuantity();
        schema.reservedQuantity = inventory.getReservedQuantity();
        schema.updatedAt = inventory.getUpdatedAt();
        return schema;
    }

    static toDomain(schema: InventorySchema): Inventory {
        return Inventory.reconstitute({
            productId: schema.productId,
            availableQuantity: schema.availableQuantity,
            reservedQuantity: schema.reservedQuantity,
            updatedAt: schema.updatedAt,
        });
    }
}