import { OmitType } from "@nestjs/mapped-types"
import { CreateProductDto } from "./create-produdct.dto";

export class PublishProductDto extends OmitType(CreateProductDto, ["initialStock"] as const) {}