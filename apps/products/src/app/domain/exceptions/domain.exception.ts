import { DomainException } from "@eco/common";
import { status } from "@grpc/grpc-js";

export abstract class ProductDomainException extends DomainException {
    readonly domainName = "Product Domain";
}

export abstract class InventoryDomainException extends DomainException {
    readonly domainName = "Inventory Domain";
}

export class ProductNotFoundException extends ProductDomainException {
    statusCode = status.NOT_FOUND;
    constructor(id: string) {
        super(`Product not found: ${id}.`);
    }
}

export class ProductUnpublishableException extends ProductDomainException {
    statusCode = status.FAILED_PRECONDITION;
    constructor() {
        super(`Product can not be published. Only products in draft states can be published.`);
    }
}

export class InventoryNotFoundException extends InventoryDomainException {
    statusCode = status.NOT_FOUND;
    constructor() {
        super(`Inventory not found.`);
    }
}

export class InventoryStockInsufficientException extends InventoryDomainException {
    statusCode = status.FAILED_PRECONDITION;
    constructor(availableQuantity: number, quantity: number) {
        super(`Cannot reserve ${quantity}. Only ${availableQuantity} available.`);
    }
}

export class InventoryReservedStockInsufficientException extends InventoryDomainException {
    statusCode = status.FAILED_PRECONDITION;
    constructor(reservedQuantity: number, quantity: number) {
        super(`Cannot release ${quantity} stocks. Only ${reservedQuantity} reserved stocks.`);
    }
}