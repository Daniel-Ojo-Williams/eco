import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-produdct.dto";

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ["initialStock"] as const)) {}