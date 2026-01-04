import { OrderItem } from "../entities/order-item.entity";
import { NoEmptyOrderException, OrderItemNotFoundException, OrderNotPendingException } from "../exceptions/domain.exception";
import { MoneyVO } from "../value-objects/money.vo";
import { OrderStatus, OrderStatusVO } from "../value-objects/order-status.vo";
import { ShippingAddressVO } from "../value-objects/shipping-address.vo";

export interface OrderAggregateProps {
    id: string;
    userId: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddressVO;
    status: OrderStatusVO;
    totalAmount: MoneyVO;
    createdAt: Date;
    updatedAt: Date;
}

export class OrderAggregate {
    private constructor (private readonly props: OrderAggregateProps) {}

    static create(
        props: {
             userId: string;
             shippingAddress: {
                 street: string;
                 city: string;
                 postalCode: string;
                 country: string 
             },
             items: {
                 productId: string; productName: string; quantity: number; price: number 
             }[]
        }
    ): OrderAggregate {
        const orderItems = props.items.map(item => OrderItem.create({ 
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            priceAtPurchase: item.price
        }))

        const totalAmount = orderItems.reduce((sum, item) => sum.add(item.getSubtotal()), MoneyVO.create(0));

        return new OrderAggregate({
            id: crypto.randomUUID(),
            status: OrderStatusVO.create(OrderStatus.PENDING_PAYMENT),
            orderItems: orderItems,
            createdAt: new Date(),
            updatedAt: new Date(),
            totalAmount,
            userId: props.userId,
            shippingAddress: ShippingAddressVO.create(props.shippingAddress)
        });
    }

    static reconstitute(props: {
        id: string;
        userId: string;
        items: {
            id: string; productId: string; productName: string; quantity: number; priceAtPurchase: number 
        }[]
        shippingAddress: { street: string; city: string; postalCode: string; country: string };
        status: string;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;

    }): OrderAggregate {
        const orderItems = props.items.map(item => OrderItem.reconstitute(item));
        
        const status = OrderStatusVO.create(props.status);
        const totalAmount = MoneyVO.create(props.totalAmount);
        const shippingAddress = ShippingAddressVO.create(props.shippingAddress);
        
        return new OrderAggregate({
            id: props.id,
            userId: props.userId,
            orderItems,
            status,
            totalAmount,
            shippingAddress,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        });
    }

    setShippingAddress(address: ShippingAddressVO): void {
        if (!this.props.status.isPending()) throw new OrderNotPendingException();
        this.props.shippingAddress = address;
        this.props.updatedAt = new Date();
    }

    addItem(props: { productId: string; productName: string; quantity: number; price: number }): void {
        if (!this.props.status.isPending()) throw new OrderNotPendingException();
        const item = OrderItem.create({ 
            productId: props.productId,
            productName: props.productName,
            quantity: props.quantity,
            priceAtPurchase: props.price
        });
        this.props.orderItems.push(item);
        this.props.totalAmount = this.calculateTotal();
        this.props.updatedAt = new Date();
    }

    removeItem(orderItemId: string) {
        if (!this.props.status.isPending()) throw new OrderNotPendingException();
        this.ensureOrderItemExists(orderItemId);
        if (this.props.orderItems.length === 1) throw new NoEmptyOrderException();
        this.props.orderItems = this.props.orderItems.filter(item => item.getId() !== orderItemId);
        this.props.totalAmount = this.calculateTotal();
        this.props.updatedAt = new Date();
    }

    private ensureOrderItemExists(itemId: string) {
        const item = this.props.orderItems.find(item => item.getId() === itemId);
        if (!item) throw new OrderItemNotFoundException();
        return item;
    }

    updateItemQuantity(orderItemId: string, quantity: number) {
        if (!this.props.status.isPending()) throw new OrderNotPendingException();
        const item = this.ensureOrderItemExists(orderItemId);
        item.updateQuantity(quantity);
        this.props.updatedAt = new Date();
    }

    private calculateTotal(): MoneyVO {
        const total = this.props.orderItems.reduce((sum, item) => sum.add(item.getSubtotal()), MoneyVO.create(0));
        return total;
    }

    getTotalAmount(): MoneyVO {
        return this.props.totalAmount;
    }

    getId(): string {
        return this.props.id;
    }

    getUserId(): string {
        return this.props.userId;
    }

    getOrderItems(): OrderItem[] {
        return [...this.props.orderItems];
    }

    getShippingAddress(): ShippingAddressVO {
        return this.props.shippingAddress;
    }

    getStatus(): OrderStatus {
        return this.props.status.getValue();
    }

    getCreatedAt(): Date {
        return this.props.createdAt;
    }

    getUpdatedAt(): Date {
        return this.props.updatedAt;
    }

    confirmPayment(): void {
        this.props.status = this.props.status.moveToPaid();
        this.props.updatedAt = new Date();
    }

    cancelOrder(): void {
        this.props.status = this.props.status.moveToCancelled();
        this.props.updatedAt = new Date();
    }

    markAsShipped(): void {
        this.props.status = this.props.status.moveToShipped();
        this.props.updatedAt = new Date();
    }

    markAsDelivered(): void {
        this.props.status = this.props.status.moveToDelivered();
        this.props.updatedAt = new Date();
    }
}