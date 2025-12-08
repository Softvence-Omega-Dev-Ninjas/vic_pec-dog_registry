import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class QueryDogDto {
    @ApiPropertyOptional({ description: "Owner ID filter" })
    @IsOptional()
    @IsUUID()
    ownerId?: string;

    @ApiPropertyOptional({ description: "Dog status filter" })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: "Dog breed filter" })
    @IsOptional()
    @IsString()
    breed?: string;
}
