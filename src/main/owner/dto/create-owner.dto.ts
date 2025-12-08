import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateOwnerDto {
    @ApiProperty({ description: "User ID" })
    @IsString()
    userId: string;

    @ApiProperty({ description: "Owner code" })
    @IsString()
    ownerCode: string;

    @ApiProperty({ description: "About owner", required: false })
    @IsOptional()
    @IsString()
    about?: string;

    @ApiProperty({ description: "Is ambassador", required: false, default: false })
    @IsOptional()
    @IsBoolean()
    isAmbassador?: boolean = false;

    @ApiProperty({ description: "Email notifications enabled", required: false, default: true })
    @IsOptional()
    @IsBoolean()
    emailNotify?: boolean = true;

    @ApiProperty({ description: "Show owner info", required: false, default: true })
    @IsOptional()
    @IsBoolean()
    showOwnerInfo?: boolean = true;

    @ApiProperty({ description: "Cover image ID", required: false })
    @IsOptional()
    @IsString()
    coverImageId?: string;
}
