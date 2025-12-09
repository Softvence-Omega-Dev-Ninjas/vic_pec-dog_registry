import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { DogService } from "./dog.service";
import { CreateDogDto } from "./dto/create-dog.dto";
import { QueryDogDto } from "./dto/query-dog.dto";
import { UpdateDogDto } from "./dto/update-dog.dto";

@ApiTags("dogs")
@Controller("dogs")
export class DogController {
    constructor(private readonly dogService: DogService) {}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "featuredImage", maxCount: 1 },
            { name: "mediaImages", maxCount: 10 },
        ]),
    )
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                ownerId: { type: "string", format: "uuid" },
                pcrId: { type: "string" },
                name: { type: "string" },
                breed: { type: "string" },
                color: { type: "string" },
                sex: { type: "string", enum: ["Male", "Female"] },
                microchip: { type: "string" },
                dateOfBirth: { type: "string", format: "date" },
                weight: { type: "number" },
                location: { type: "string" },
                healthStatus: { type: "string" },
                primaryBreedPercentage: { type: "number" },
                secondaryBreed: { type: "string" },
                secondaryBreedPercentage: { type: "number" },
                vaccinations: { type: "string" },
                healthClearances: { type: "string" },
                healthNotes: { type: "string" },
                featuredImage: { type: "string", format: "binary" },
                mediaImages: { type: "array", items: { type: "string", format: "binary" } },
            },
            required: [
                "ownerId",
                "pcrId",
                "name",
                "breed",
                "color",
                "sex",
                "microchip",
                "dateOfBirth",
                "weight",
                "location",
            ],
        },
    })
    @ApiOperation({ summary: "Create a new dog registration" })
    async create(
        @Body() dto: CreateDogDto,
        @UploadedFiles()
        files: {
            featuredImage?: Express.Multer.File[];
            mediaImages?: Express.Multer.File[];
        },
    ) {
        try {
            const featuredImage = files?.featuredImage?.[0];
            const mediaImages = files?.mediaImages || [];

            let featuredImageId: string | undefined;
            if (featuredImage) {
                featuredImageId = await this.dogService.uploadFile(featuredImage);
            }

            let mediaImageIds: string[] = [];
            if (mediaImages.length > 0) {
                mediaImageIds = await Promise.all(
                    mediaImages.map((file) => this.dogService.uploadFile(file)),
                );
            }

            return await this.dogService.create({
                ...dto,
                featuredImageId,
                mediaImageIds: mediaImageIds.join(","),
            });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to create dog");
        }
    }

    @Get()
    @ApiOperation({ summary: "Get all dogs" })
    @ApiQuery({ type: QueryDogDto })
    async findAll(@Query() query: QueryDogDto) {
        try {
            return await this.dogService.findAll(query);
        } catch (error) {
            throw new BadRequestException(error.message || "Failed to fetch dogs");
        }
    }

    @Get(":id")
    @ApiOperation({ summary: "Get dog by ID" })
    @ApiParam({ name: "id", description: "Dog ID" })
    async findOne(@Param("id") id: string) {
        try {
            return await this.dogService.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to fetch dog");
        }
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update dog information" })
    @ApiParam({ name: "id", description: "Dog ID" })
    async update(@Param("id") id: string, @Body() dto: UpdateDogDto) {
        try {
            return await this.dogService.update(id, dto);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to update dog");
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete dog" })
    @ApiParam({ name: "id", description: "Dog ID" })
    async remove(@Param("id") id: string) {
        try {
            return await this.dogService.remove(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to delete dog");
        }
    }

    @Patch(":id/health")
    @ApiOperation({ summary: "Update dog health status" })
    @ApiParam({ name: "id", description: "Dog ID" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                healthStatus: { type: "string" },
            },
        },
    })
    async updateHealth(@Param("id") id: string, @Body() body: { healthStatus: string }) {
        try {
            return await this.dogService.updateHealth(id, body.healthStatus);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to update health");
        }
    }

    @Post(":id/media")
    @ApiOperation({ summary: "Add media to dog" })
    @ApiParam({ name: "id", description: "Dog ID" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                fileIds: {
                    type: "array",
                    items: { type: "string", format: "uuid" },
                },
            },
        },
    })
    async addMedia(@Param("id") id: string, @Body() body: { fileIds: string[] }) {
        try {
            return await this.dogService.addMedia(id, body.fileIds);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to add media");
        }
    }
}
