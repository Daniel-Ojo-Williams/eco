import { Product } from "../../../../domain";
import { ProductDocument } from "../schemas/product.schema";


export class ProductMapper {
    static toDocument(product: Product): ProductDocument {
        return {
            _id: product.getId(),
            name: product.getName(),
            description: product.getDescription(),
            category: product.getCategory(),
            price: product.getPrice().getAmount(),
            images: product.getImages(),
            specifications: new Map(Object.entries(product.getSpecifications())),
            status: product.getStatus().getValue(),
            createdAt: product.getCreatedAt(),
            updatedAt: product.getUpdatedAt(),
        };
    }

    static toDomain(doc: ProductDocument): Product {
        return Product.reconstitute({
            id: doc._id,
            name: doc.name,
            description: doc.description,
            category: doc.category,
            price: doc.price,
            images: doc.images,
            specifications: Object.fromEntries(doc.specifications),
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
}