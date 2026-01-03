import { Inject, Injectable } from "@nestjs/common";
import { IProductRepository, Product, PRODUCT_REPOSITORY } from "../../domain";
import { ProductNotFoundException, ProductUnpublishableException } from "../../domain/exceptions/domain.exception";

@Injectable()
export class PublishProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository
    ) {}

    async execute(productId: string): Promise<Product> {
            const product = await this.productRepository.findById(productId);

            if (!product) throw new ProductNotFoundException(productId);

            if (!product.getStatus().canPublish()) throw new ProductUnpublishableException()
            
            product.publish()

            await this.productRepository.save(product);            

            return product;
    }
}