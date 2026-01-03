import { Inject, Injectable } from "@nestjs/common";
import { IInventoryRepository, Inventory, INVENTORY_REPOSITORY, IProductRepository, Product, PRODUCT_REPOSITORY } from "../../domain";
import { CreateProductDto } from "../dto/create-produdct.dto";

@Injectable()
export class CreateProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
        @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepository: IInventoryRepository
    ) {}

    async execute(createProductDto: CreateProductDto): Promise<Product> {
        let product: Product;
        try {
            const { initialStock, ...dto } = createProductDto;
            product = Product.create({ ...dto  });
            await this.productRepository.save(product);
            const inventory = Inventory.create(product.getId(), initialStock);
            await this.inventoryRepository.save(inventory);

            return product;
        } catch (error) {
            if (product) await this.productRepository.delete(product.getId())
            throw error;
        }
            
    }
}