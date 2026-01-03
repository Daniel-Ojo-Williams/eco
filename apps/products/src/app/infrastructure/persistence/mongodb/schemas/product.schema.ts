import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProductStatus } from "../../../../domain/value-objects/product-status.vo"; 
import { HydratedDocument } from "mongoose";

export const PRODUCT_COLLECTION_NAME = "products";

@Schema({ collection: PRODUCT_COLLECTION_NAME, timestamps: true })
export class ProductDocument {
    @Prop({ required: true })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, index: true })
    category: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ type: Map, of: String, default: {} })
    specifications: Map<string, string>;

    @Prop({ required: true, enum: Object.values(ProductStatus), default: "draft", index: true })
    status: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export type ProductDocumentHydrated = HydratedDocument<ProductDocument>;

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);

ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ status: 1, createdAt: -1 });
