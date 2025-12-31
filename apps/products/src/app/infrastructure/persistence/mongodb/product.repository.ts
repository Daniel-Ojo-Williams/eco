import { InjectModel } from "@nestjs/mongoose";
import { IProductRepository } from "../../../domain";
import { ProductDocument } from "./schemas/product.schema";
import { Model } from "mongoose";
import { Product } from "../../../domain";
import { ProductMapper } from "./mappers/products.mapper";

export class ProductRepository implements IProductRepository {
    constructor(@InjectModel(ProductDocument.name) private readonly productModel: Model<ProductDocument>) {}

    async save(product: Product) {
        const doc = ProductMapper.toDocument(product);
        await this.productModel.updateOne(
            { _id: doc._id },
            { $set: doc },
            { upsert: true } 
        );
    }

    async findById(id: string) {
        const doc = await this.productModel.findById(id).exec();
        if (!doc) {
            return null;
        }
        return ProductMapper.toDomain(doc);
    }

    async findByCategory(category: string) {
        const docs = await this.productModel.find({ category }).exec();
        return docs.map(doc => ProductMapper.toDomain(doc));
    }

    async findAll(options?: { limit?: number; page?: number; }) {
        const page = options?.page ? options.page : 1;
        const limit = options?.limit ? options.limit : 10;
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            this.productModel.find().limit(limit).skip(skip).exec(),
            this.productModel.countDocuments().exec(),
        ]);
        const products = docs.map(doc => ProductMapper.toDomain(doc));
        return { products, total, page };
    }

    async search(query: string) {
        const docs = await this.productModel.find({ $text: { $search: query }, status: "published" }).exec();
        return docs.map(doc => ProductMapper.toDomain(doc));
    }

    async delete(id: string): Promise<void> {
        await this.productModel.deleteOne({ _id: id }).exec();
    }

    async exists(id: string): Promise<boolean> {
        return !!(await this.productModel.exists({ _id: id }).exec());
    }
}