import { OrderItemQuantityInvalid } from "../exceptions/domain.exception";
import { MoneyVO } from "../value-objects/money.vo";

export interface OrderItemProps {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    priceAtPurchase: MoneyVO;
}

export class OrderItem {
    private constructor(private readonly props: OrderItemProps) {}

    static create(props: Omit<OrderItemProps, "subTotal" | "priceAtPurchase" | "id"> & { priceAtPurchase: number; }) {
        const priceAtPurchase = MoneyVO.create(props.priceAtPurchase);
        const id = crypto.randomUUID();
        return new OrderItem({ ...props, priceAtPurchase, id });
    }

    static reconstitute(props: Omit<OrderItemProps, "priceAtPurchase"> & { priceAtPurchase: number; }) {
        const priceAtPurchase = MoneyVO.create(props.priceAtPurchase);
        return new OrderItem({ ...props, priceAtPurchase });
    }
    
    getId(): string {
        return this.props.id;
    }
    
    getProductId(): string {
        return this.props.productId;
    }
    
    getProductName(): string {
        return this.props.productName;
    }

    getQuantity(): number {
        return this.props.quantity;
    }
    
    getPriceAtPurchase(): MoneyVO {
        return this.props.priceAtPurchase;
    }
    
    getSubtotal(): MoneyVO {
        return this.props.priceAtPurchase.multiply(this.props.quantity);
    }
    
    updateQuantity(quantity: number) {
        if (quantity < 0) {
            throw new OrderItemQuantityInvalid();
        }
        this.props.quantity = quantity;
    }
}