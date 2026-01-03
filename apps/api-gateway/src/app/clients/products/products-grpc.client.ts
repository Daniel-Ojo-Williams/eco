import { products } from "@eco/grpc";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { grpcWrapper } from "../../helpers";

@Injectable()
export class ProductsGrpcClient implements OnModuleInit {
    constructor(@Inject(products.PRODUCT_SERVICE_NAME) private readonly client: ClientGrpc) {}
    private productsService: products.ProductServiceClient;

    onModuleInit() {
        this.productsService = this.client.getService<products.ProductServiceClient>(products.PRODUCT_SERVICE_NAME);
    }

    async listProducts(data: products.ListProductsRequest): Promise<products.ProductListResponse> {
        return grpcWrapper(this.productsService.listProducts(data));
    }

    async createProduct(data: products.CreateProductRequest): Promise<products.ProductResponse> {
        return grpcWrapper(this.productsService.createProduct(data));
    }

    async getProduct(id: string): Promise<products.ProductResponse> {
        return grpcWrapper(this.productsService.getProduct({id}));
    }

    async updateProduct(data: products.UpdateProductRequest): Promise<products.ProductResponse> {
        return grpcWrapper(this.productsService.updateProduct(data));
    }

    async deleteProduct(id: string): Promise<products.Empty> {
        return grpcWrapper(this.productsService.deleteProduct({id}));
    }

    async restockInventory(data: products.UpdateInventoryRequest): Promise<products.InventoryResponse> {
        return grpcWrapper(this.productsService.updateInventory(data));
    }

    async getInventory(data: products.GetInventoryRequest): Promise<products.InventoryResponse> {
        return grpcWrapper(this.productsService.getInventory(data));
    }

    async reserveStock(data: products.ReserveStockRequest): Promise<products.InventoryResponse> {
        return grpcWrapper(this.productsService.reserveStock(data));
    }

    async releaseStock(data: products.ReleaseStockRequest): Promise<products.InventoryResponse> {
        return grpcWrapper(this.productsService.releaseStock(data));
    }

    async publishProduct(id: string): Promise<products.ProductResponse> {
        return grpcWrapper(this.productsService.publishProduct({id}));
    }
}