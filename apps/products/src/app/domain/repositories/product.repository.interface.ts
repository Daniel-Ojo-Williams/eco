import { Product } from "../entities/product.entity";

export interface IProductRepository {
    save(product: Product): Promise<void>;
    findById(id: string): Promise<Product | null>;
    findByCategory(category: string): Promise<Product[]>;
    findAll(options?: { limit?: number; page?: number; category?: string, search?: string }): Promise<{ products: Product[]; total: number, page: number }>;
    search(query: string): Promise<Product[]>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = "PRODUCT_REPOSITORY";