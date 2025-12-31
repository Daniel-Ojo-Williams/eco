import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class InventorySchema {
    @PrimaryColumn("uuid", { name: "product_id" })
    productId: string;

    @Column({
        name: "available_quantity",
        type: "integer",
        default: 0
    })
    availableQuantity: number;

    @Column({
        name: "reserved_quantity",
        type: "integer",
        default: 0
    })
    reservedQuantity: number;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
