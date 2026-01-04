import { DomainException } from "@eco/common";
import { status } from "@grpc/grpc-js";

abstract class OrdersDomainException extends DomainException {
    readonly domainName = "Orders Domain";
}

export class OrderStatusInvalidException extends OrdersDomainException {
    statusCode: number = status.INVALID_ARGUMENT;
    constructor(orderStatus: string) {
        super(`Invalid order status: ${orderStatus}`);
    }
}

export class OrderStatusTransitionException extends OrdersDomainException {
    statusCode: number = status.FAILED_PRECONDITION;
    constructor(fromStatus: string, toStatus: string) {
        super(`Cannot transition from ${fromStatus} to ${toStatus}`);
    }
}

export class OrderItemNotFoundException extends OrdersDomainException {
    statusCode: number = status.NOT_FOUND;
    constructor() {
        super("Order item not found");
    }
}

export class OrderItemQuantityInvalid extends OrdersDomainException {
    statusCode: number = status.INVALID_ARGUMENT;
    
    constructor() {
        super("Invalid order item quantity.Order item quantity cannot be negative and cannot be infinite.");
    }
}

export class OrderNotPendingException extends OrdersDomainException {
    statusCode: number = status.FAILED_PRECONDITION;
    
    constructor() {
        super("Order must be in pending status to update order.");
    }
}

export class NoEmptyOrderException extends OrdersDomainException {
    statusCode: number = status.FAILED_PRECONDITION;

    constructor() {
        super("Order can not be empty. Order must have at least one item.");
    }
}