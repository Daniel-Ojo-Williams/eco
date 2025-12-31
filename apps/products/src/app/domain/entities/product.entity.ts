import { Money } from "../value-objects/money.vo";
import { ProductStatusVO } from "../value-objects/product-status.vo";

export interface ProductSpecifications {
    [key: string]: string;
}

interface ProductProps {
    id: string;
    name: string;
    description: string;
    category: string;
    price: Money,
    images: string[],
    specifications: ProductSpecifications,
    status: ProductStatusVO,
    createdAt: Date,
    updatedAt: Date,
}

export class Product {
    private constructor(private props: ProductProps) {}

    static create(props: {
        name: string;
        category: string;
        description: string;
        price: number;
        images?: string[];
        specifications?: ProductSpecifications;
    }) {
        const price = Money.create(props.price);
        if (!price.isGreaterThan(Money.zero())) {
            throw new Error("Price must be greater than 0");
        };

        const name = props.name.trim();
        if (!name) {
            throw new Error("Name can not be empty");
        }

        return new Product({
            id: crypto.randomUUID(),
            name,
            description: props.description,
            price,
            category: props.category,
            images: props.images || [],
            specifications: props.specifications || {},
            status: ProductStatusVO.createDraft(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static reconstitute(props: {
        id: string;
        name: string;
        description: string;
        category: string;
        price: number;
        images: string[];
        specifications: ProductSpecifications;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }) {

        return new Product({
            id: props.id,
            name: props.name,
            description: props.description,
            category: props.category,
            price: Money.create(props.price),
            images: props.images,
            specifications: props.specifications,
            status: ProductStatusVO.fromString(props.status),
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
    }

    publish() {
        if (!this.props.status.canPublish()) {
            throw new Error("Only draft products can be published");
        }
        this.props.status = ProductStatusVO.createPublished();
        this.props.updatedAt = new Date();
    }

    archive() {
        if (!this.props.status.canArchive()) {
            throw new Error("Only published products can be archived");
        }
        this.props.status = ProductStatusVO.createArchived();
        this.props.updatedAt = new Date();
    }

    updatePrice(newPrice: number) {
        const price = Money.create(newPrice);
        if (!price.isGreaterThan(Money.zero())) {
            throw new Error("Price must be greater than 0");
        }
        this.props.price = price;
        this.props.updatedAt = new Date();
    }

    updateDetails(data: Partial<{ name: string; description: string; category: string }>) {
        if (!data || !Object.keys(data).length) return;

        if (data.name) {
            const name = data.name.trim();
            if (!name) {
                throw new Error("Name can not be empty");
            }
            this.props.name = name;
        }

        if (data.description) {
            this.props.description = data.description;
        }

        if (data.category) {
            this.props.category = data.category;
        }

        this.props.updatedAt = new Date();
    }

    addImage(imageUrl: string) {
        this.props.images.push(imageUrl);
        this.props.updatedAt = new Date();
    }

    removeImage(imageUrl: string) {
        if (this.props.images.indexOf(imageUrl) === -1) {
            throw new Error("Image not found");
        }
        this.props.images = this.props.images.filter(image => image !== imageUrl);
        this.props.updatedAt = new Date();
    }

    getId() {
        return this.props.id;
    }

    getName() {
        return this.props.name;
    }

    getImages() {
        return [...this.props.images];
    }

    getDescription() {
        return this.props.description;
    }

    getCategory() {
        return this.props.category;
    }

    getPrice() {
        return this.props.price;
    }

    getSpecifications() {
        return this.props.specifications;
    }

    getStatus() {
        return this.props.status;
    }

    getCreatedAt() {
        return this.props.createdAt;
    }

    getUpdatedAt() {
        return this.props.updatedAt;
    }
}