import { Controller } from "@nestjs/common";
import { products } from "@eco/grpc"
import { CreateProductUseCase } from "../application/use-cases/create-product.use-case";
import { GetProductUseCase } from "../application/use-cases/get-product.use-case";
import { ReserveStockUseCase } from "../application/use-cases/reserve-stock.use-case";
import { Inventory, Product } from "../domain";
import { ReleaseStockUseCase } from "../application/use-cases/release-stock.use-case";
import { UpdateProductUseCase } from "../application/use-cases/update-product.use-case";
import { DeleteProductUseCase } from "../application/use-cases/delete-product.use-case";
import { PublishProductUseCase } from "../application/use-cases/publish-product.use-case";
import { ListProductsUseCase } from "../application/use-cases/list-products.use-case";
import { RestockInventoryUseCase } from "../application/use-cases/restock-inventory.use-case";
import { GetInventoryUseCase } from "../application/use-cases/get-inventory.use-case";

function productResponseMapper(product: Product): products.ProductResponse {
        return {
            id: product.getId(),
            name: product.getName(),
            category: product.getCategory(),
            price: product.getPrice().getAmount(),
            images: product.getImages(),
            specifications: product.getSpecifications(),
            status: product.getStatus().getValue(),
            createdAt: product.getCreatedAt().toISOString(),
            updatedAt: product.getUpdatedAt().toISOString(),
            description: product.getDescription(),
        };
}

function inventoryResponseMapper(inventory: Inventory): products.InventoryResponse {
    return {
            updatedAt: inventory.getUpdatedAt().toISOString(),
            productId: inventory.getProductId(),
            availableQuantity: inventory.getAvailableQuantity(),
            reservedQuantity: inventory.getReservedQuantity(),
            totalQuantity: inventory.getTotalQuantity(),
        }
}

@Controller()
@products.ProductServiceControllerMethods()
export class ProductsGrpcController implements products.ProductServiceController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly getProductUseCase: GetProductUseCase,
        private readonly reserveStockUseCase: ReserveStockUseCase,
        private readonly releaseStockUseCase: ReleaseStockUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly listProductsUseCase: ListProductsUseCase,
        private readonly publishProductUseCase: PublishProductUseCase,
        private readonly restockInventoryUseCase: RestockInventoryUseCase,
        private readonly getInventoryUseCase: GetInventoryUseCase,
    ) {}
    async createProduct(request: products.CreateProductRequest): Promise<products.ProductResponse> {
        const product = await this.createProductUseCase.execute(request)

        return productResponseMapper(product);
    }

    async getProduct(request: products.GetProductRequest): Promise<products.ProductResponse> {
        const response = await this.getProductUseCase.execute(request.id)

        return productResponseMapper(response.product)
    }
    async updateProduct(request: products.UpdateProductRequest): Promise<products.ProductResponse> {
        const product = await this.updateProductUseCase.execute(request.id, request)
        return productResponseMapper(product);
    }
    async deleteProduct(request: products.DeleteProductRequest): Promise<products.Empty> {
        await this.deleteProductUseCase.execute(request.id);
        return {};
    }
    async listProducts(request: products.ListProductsRequest): Promise<products.ProductListResponse> {
        const response = await this.listProductsUseCase.execute(request);
        return {
            ...response,
            products: response.products.map(productResponseMapper),
        };
    }
    async publishProduct(request: products.PublishProductRequest): Promise<products.ProductResponse> {
        const product = await this.publishProductUseCase.execute(request.id);
        return productResponseMapper(product);
    }
    async updateInventory(request: products.UpdateInventoryRequest): Promise<products.InventoryResponse> {
        const inventory = await this.restockInventoryUseCase.execute(request.productId, { quantity: request.quantity });
        return inventoryResponseMapper(inventory);
    }
    async getInventory(request: products.GetInventoryRequest): Promise<products.InventoryResponse> {
        const inventory = await this.getInventoryUseCase.execute(request.productId);
        return inventoryResponseMapper(inventory);
    }
    async reserveStock(request: products.ReserveStockRequest): Promise<products.InventoryResponse> {
        const inventory = await this.reserveStockUseCase.execute(request.productId, { quantity: request.quantity })
        return inventoryResponseMapper(inventory);
    }
    async releaseStock(request: products.ReleaseStockRequest): Promise<products.InventoryResponse> {
        const inventory = await this.releaseStockUseCase.execute(request.productId, { quantity: request.quantity });
        return inventoryResponseMapper(inventory);
    }
}