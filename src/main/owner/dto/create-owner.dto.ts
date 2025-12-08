import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateOwnerDto {
    // ---------------------------
    // User Information
    // ---------------------------
    @ApiProperty({ description: "User name" })
    @IsString()
    name: string;

    @ApiProperty({ description: "User email" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "User password" })
    @IsString()
    password: string;

    @ApiProperty({ description: "User phone" })
    @IsString()
    phone: string;

    @ApiProperty({ description: "User address", required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ description: "User type", required: false, default: "OWNER" })
    @IsOptional()
    @IsString()
    userType?: string = "OWNER";

    @ApiProperty({ description: "User status", required: false, default: "pending" })
    @IsOptional()
    @IsString()
    status?: string = "pending";

    @ApiProperty({
        type: "string",
        format: "binary",
        description: "User profile image ID",
        required: false,
    })
    @IsOptional()
    @IsString()
    profileImageId?: string;

    // ---------------------------
    // Owner Information
    // ---------------------------
    @ApiProperty({ description: "Owner code (auto generated)", required: false })
    @IsOptional()
    @IsString()
    ownerCode?: string;

    @ApiProperty({ description: "About owner", required: false })
    @IsOptional()
    @IsString()
    about?: string;

    @ApiProperty({ description: "Is ambassador", required: false, default: false })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === "string") return value === "true" || value === "1";
        return value;
    })
    @IsBoolean()
    isAmbassador?: boolean = false;

    @ApiProperty({ description: "Email notifications enabled", required: false, default: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === "string") return value === "true" || value === "1";
        return value;
    })
    @IsBoolean()
    emailNotify?: boolean = true;

    @ApiProperty({ description: "Show owner info", required: false, default: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === "string") return value === "true" || value === "1";
        return value;
    })
    @IsBoolean()
    showOwnerInfo?: boolean = true;

    @ApiProperty({ description: "Cover image ID", required: false })
    @IsOptional()
    @IsString()
    coverImageId?: string;
}
