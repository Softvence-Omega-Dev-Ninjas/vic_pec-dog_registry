import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class QueryOwnerDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isAmbassador?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    emailNotify?: boolean;
}
