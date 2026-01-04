import { OrderStatusInvalidException, OrderStatusTransitionException } from "../exceptions/domain.exception";

export enum OrderStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    PAYMENT_FAILED = 'PAYMENT_FAILED'
}

export class OrderStatusVO {
    private constructor(private readonly status: OrderStatus) {}
    
    static create(status: string) {
        if (!this.isValidStatus(status)) {
            throw new OrderStatusInvalidException(status);
        }
        return new OrderStatusVO(status);
    }

    private static isValidStatus(status: string): status is OrderStatus {
        return Object.values(OrderStatus).includes(status as OrderStatus);
    }
    
    
    getValue(): OrderStatus {
        return this.status;
    }

    canTransitionTo(newStatus: OrderStatus): boolean {
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED, OrderStatus.PAYMENT_FAILED],
            [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
            [OrderStatus.DELIVERED]: [],
            [OrderStatus.CANCELLED]: [],
            [OrderStatus.PAYMENT_FAILED]: [OrderStatus.PAID, OrderStatus.CANCELLED]
        };
        
        return validTransitions[this.status]?.includes(newStatus);
    }

    moveToPaid(): OrderStatusVO {
        if (!this.canTransitionTo(OrderStatus.PAID)) {
            throw new OrderStatusTransitionException(this.status, OrderStatus.PAID);
        }
        return new OrderStatusVO(OrderStatus.PAID);
    }

    moveToShipped(): OrderStatusVO {
        if (!this.canTransitionTo(OrderStatus.SHIPPED)) {
            throw new OrderStatusTransitionException(this.status, OrderStatus.SHIPPED);
        }
        return new OrderStatusVO(OrderStatus.SHIPPED);
    }

    moveToDelivered(): OrderStatusVO {
        if (!this.canTransitionTo(OrderStatus.DELIVERED)) {
            throw new OrderStatusTransitionException(this.status, OrderStatus.DELIVERED);
        }
        return new OrderStatusVO(OrderStatus.DELIVERED);
    }

    moveToPaymentFailed(): OrderStatusVO {
        if (!this.canTransitionTo(OrderStatus.PAYMENT_FAILED)) {
            throw new OrderStatusTransitionException(this.status, OrderStatus.PAYMENT_FAILED);
        }
        return new OrderStatusVO(OrderStatus.PAYMENT_FAILED);
    }

    moveToCancelled(): OrderStatusVO {
        if (!this.canTransitionTo(OrderStatus.CANCELLED)) {
            throw new OrderStatusTransitionException(this.status, OrderStatus.CANCELLED);
        }
        return new OrderStatusVO(OrderStatus.CANCELLED);
    }

    cancel(): OrderStatusVO {
        if (!this.canTransitionTo(OrderStatus.CANCELLED)) {
            throw new OrderStatusTransitionException(this.status, OrderStatus.CANCELLED);
        }
        return new OrderStatusVO(OrderStatus.CANCELLED);
    }

    isCompleted(): boolean {
        return this.status === OrderStatus.DELIVERED || this.status === OrderStatus.CANCELLED;
    }

    isInProgress(): boolean {
        return this.status !== OrderStatus.PENDING_PAYMENT && !this.isCompleted();
    }
    
    isPending(): boolean {
        return this.status === OrderStatus.PENDING_PAYMENT;
    }
    
    isPaid(): boolean {
        return this.status === OrderStatus.PAID;
    }
    
    isShipped(): boolean {
        return this.status === OrderStatus.SHIPPED;
    }
    
    isDelivered(): boolean {
        return this.status === OrderStatus.DELIVERED;
    }
    
    isCancelled(): boolean {
        return this.status === OrderStatus.CANCELLED;
    }
}