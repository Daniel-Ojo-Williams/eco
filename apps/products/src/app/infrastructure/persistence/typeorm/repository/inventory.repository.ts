import { Injectable } from "@nestjs/common";
import { IInventoryRepository, Inventory } from "../../../../domain";
import { InjectRepository } from "@nestjs/typeorm";
import { InventorySchema } from "../schemas";
import { DataSource, Repository } from "typeorm";
import { InventoryMapper } from "../mappers/inventory.mapper";
import { InventoryNotFoundException } from "../../../../domain/exceptions/domain.exception";

@Injectable()
export class InventoryRepository implements IInventoryRepository {
    constructor(
        @InjectRepository(InventorySchema) private readonly ormRepository: Repository<InventorySchema>,
        private readonly datasource: DataSource
    ) {}

    async save(inventory: Inventory): Promise<void> {
        const schema = InventoryMapper.toSchema(inventory)
        await this.ormRepository.save(this.ormRepository.create(schema))
    }

    async findByProductId(productId: string): Promise<Inventory | null> {
        const schema = await this.ormRepository.findOneBy({ productId });

        return schema ? InventoryMapper.toDomain(schema) :  null
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete({ productId: id });
    }

    async exists(id: string): Promise<boolean> {
        return this.ormRepository.existsBy({ productId: id })
    }

    async findByProductIdForUpdate(productId: string): Promise<Inventory | null > {
        const schema = await this.ormRepository.findOne({
            where: { productId },
            lock: { mode: "pessimistic_write" }
        })

        return schema ? InventoryMapper.toDomain(schema) :  null
    }

    async executeInTransaction<T>(productId: string, operation: (inventory: Inventory) => Promise<T> | T): Promise<T> {
        return await this.datasource.transaction(async (manager) => {
            const schema = await manager.findOne(InventorySchema, {
                where: { productId },
                lock: { mode: "pessimistic_write" }
            })
    
            if (!schema) throw new InventoryNotFoundException();
    
            const inventory = InventoryMapper.toDomain(schema);
    
            const operationResult = await operation(inventory);
    
            const updatedSchema = InventoryMapper.toSchema(inventory);
    
            await manager.save(updatedSchema);
            
            return operationResult
        })
    }
    
}