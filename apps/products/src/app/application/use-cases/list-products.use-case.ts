import { Injectable } from "@nestjs/common";
import { ListProductDto } from "../dto/list-product.dto";
import { PRODUCT_REPOSITORY, IProductRepository } from "../../domain";
import { Inject } from "@nestjs/common";

@Injectable()
export class ListProductsUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
    ) {}

    async execute(dto: ListProductDto) {
        const { category, search } = dto;
        if (!dto.page) dto.page = 1;
        if (!dto.limit) dto.limit = 10;
        const options = { page: dto.page, limit: dto.limit, category, search };
        const response = await this.productRepository.findAll(options);
        return {
            ...response,
            limit: dto.limit,
        }
    }
}