import { IsNumber } from "class-validator";

export class ReserveInventoryDto {
    @IsNumber()
    quantity: number;
}