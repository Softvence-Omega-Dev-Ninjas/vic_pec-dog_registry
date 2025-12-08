import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDogDto {
    @ApiProperty({ description: "Owner ID" })
    @IsUUID()
    ownerId: string;

    @ApiProperty({ description: "PCR ID (unique)" })
    @IsString()
    pcrId: string;

    @ApiProperty({ description: "Dog name" })
    @IsString()
    name: string;

    @ApiProperty({ description: "Dog breed" })
    @IsString()
    breed: string;

    @ApiProperty({ description: "Dog color" })
    @IsString()
    color: string;

    @ApiProperty({ description: "Dog sex", enum: ["Male", "Female"] })
    @IsString()
    sex: string;

    @ApiProperty({ description: "Microchip number (unique)" })
    @IsString()
    microchip: string;

    @ApiProperty({ description: "Date of birth" })
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty({ description: "Weight in lbs/kg" })
    @Transform(({ value }) =>
        value === undefined || value === null || value === "" ? undefined : Number(value),
    )
    @IsNumber()
    weight: number;

    @ApiProperty({ description: "Location (City, State)" })
    @IsString()
    location: string;

    @ApiProperty({ description: "Health status", required: false })
    @IsOptional()
    @IsString()
    healthStatus?: string;

    @ApiProperty({
        description: "Primary breed DNA percentage",
        required: false,
        example: 98.5,
    })
    @IsOptional()
    @Transform(({ value }) =>
        value === undefined || value === null || value === "" ? undefined : Number(value),
    )
    @IsNumber()
    primaryBreedPercentage?: number;

    @ApiProperty({
        description: "Secondary breed (optional)",
        required: false,
    })
    @IsOptional()
    @IsString()
    secondaryBreed?: string;

    @ApiProperty({
        description: "Secondary breed DNA percentage",
        required: false,
        example: 1.5,
    })
    @IsOptional()
    @Transform(({ value }) =>
        value === undefined || value === null || value === "" ? undefined : Number(value),
    )
    @IsNumber()
    secondaryBreedPercentage?: number;

    @ApiProperty({
        description: "Vaccinations as comma-separated string",
        required: false,
        example: "Rabies,DHPP,Bordatella",
    })
    @IsOptional()
    @IsString()
    vaccinations?: string;

    @ApiProperty({
        description: "Health clearances as comma-separated string",
        required: false,
        example: "Hip Dysplasia Clear,Elbow Clear",
    })
    @IsOptional()
    @IsString()
    healthClearances?: string;

    @ApiProperty({ description: "Health notes", required: false })
    @IsOptional()
    @IsString()
    healthNotes?: string;

    @ApiProperty({
        description: "Featured image ID",
        required: false,
    })
    @IsOptional()
    @IsString()
    featuredImageId?: string;

    @ApiProperty({ description: "Media image IDs (comma-separated)", required: false })
    @IsOptional()
    @IsString()
    mediaImageIds?: string;
}
