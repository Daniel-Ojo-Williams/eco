interface InventoryProps {
    productId: string;
    availableQuantity: number;
    reservedQuantity: number;
    updatedAt: Date;
}

export class Inventory {
    private constructor(private props: InventoryProps) {}

    static create(productId: string, initialQuantity: number) {
        if (initialQuantity <= 0) {
            throw new Error("Initial quantity must be greater than 0");
        }

        return new Inventory({
            productId,
            availableQuantity: initialQuantity,
            reservedQuantity: 0,
            updatedAt: new Date(),
        });
    }

    static reconstitute(props: {
        productId: string;
        availableQuantity: number;
        reservedQuantity: number;
        updatedAt: Date;
    }) {
        return new Inventory(props);
    }

    reserve(quantity: number) {
        this.validateQuantity(quantity);
        
        if (quantity > this.props.availableQuantity) {
            throw new Error(`Cannot reserve ${quantity}. Only ${this.props.availableQuantity} available.`);
        }

        this.props.availableQuantity -= quantity;
        this.props.reservedQuantity += quantity;
        this.props.updatedAt = new Date();
    }

    release(quantity: number) {
        this.validateQuantity(quantity);
        
        if (quantity > this.props.reservedQuantity) {
            throw new Error(`Cannot release ${quantity}. Only ${this.props.reservedQuantity} reserved.`);
        }

        this.props.availableQuantity += quantity;
        this.props.reservedQuantity -= quantity;
        this.props.updatedAt = new Date();
    }

    restock(quantity: number) {
        this.validateQuantity(quantity);
        this.props.availableQuantity += quantity;
        this.props.updatedAt = new Date();
    }

    deduct(quantity: number) {
        this.validateQuantity(quantity);

        if (quantity > this.props.availableQuantity) {
            throw new Error(`Cannot deduct ${quantity}. Only ${this.props.availableQuantity} available.`);
        }

        this.props.availableQuantity -= quantity;
        this.props.updatedAt = new Date();
    }

    confirmSale(quantity: number) {
        this.validateQuantity(quantity);

        if (quantity > this.props.reservedQuantity) {
            throw new Error(`Cannot confirm sale of ${quantity}. Only ${this.props.reservedQuantity} reserved.`);
        }

        this.props.reservedQuantity -= quantity;
        this.props.updatedAt = new Date();
    }

    private validateQuantity(quantity: number) {
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }
    }

    getProductId() {
        return this.props.productId;
    }

    getTotalQuantity() {
        return this.props.availableQuantity + this.props.reservedQuantity;
    }

    isInStock() {
        return this.props.availableQuantity > 0;
    }

    canReserve(quantity: number) {
        return this.props.availableQuantity >= quantity;
    }

    getAvailableQuantity() {
        return this.props.availableQuantity;
    }

    getReservedQuantity() {
        return this.props.reservedQuantity;
    }

    getUpdatedAt() {
        return this.props.updatedAt;
    }
}