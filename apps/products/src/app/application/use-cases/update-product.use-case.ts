import { Injectable } from "@nestjs/common";
import { UpdateProductDto } from "../dto/update-product.dto";
import { PRODUCT_REPOSITORY, IProductRepository } from "../../domain";
import { ProductNotFoundException } from "../../domain/exceptions/domain.exception";
import { Inject } from "@nestjs/common";

@Injectable()
export class UpdateProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
    ) {}

    async execute(id: string, dto: UpdateProductDto) {
        const product = await this.productRepository.findById(id);
        if (!product) throw new ProductNotFoundException(id);
        product.updateDetails(dto);
        await this.productRepository.save(product);
        return product;       
    }
}