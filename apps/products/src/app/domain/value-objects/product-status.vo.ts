export enum ProductStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

export class ProductStatusVO {
    private  constructor(private readonly status: ProductStatus) {}

    static createDraft(): ProductStatusVO {
        return new ProductStatusVO(ProductStatus.DRAFT);
    }

    static createPublished(): ProductStatusVO {
        return new ProductStatusVO(ProductStatus.PUBLISHED);
    }

    static createArchived(): ProductStatusVO {
        return new ProductStatusVO(ProductStatus.ARCHIVED);
    }

    static fromString(status: string): ProductStatusVO {
        if (!this.isValidStatus(status)) {
            throw new Error("Invalid product status");
        }
        return new ProductStatusVO(status);
    }

    private static isValidStatus(status: string): status is ProductStatus {
        return Object.values(ProductStatus).includes(status as ProductStatus);
    }

    canPublish(): boolean {
        return this.status === ProductStatus.DRAFT;
    }

    canArchive(): boolean {
        return this.status === ProductStatus.PUBLISHED;
    }

    getValue(): ProductStatus {
        return this.status;
    }
}