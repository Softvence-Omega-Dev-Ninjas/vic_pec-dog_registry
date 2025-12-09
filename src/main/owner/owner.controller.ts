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
import { CreateOwnerDto } from "./dto/create-owner.dto";
import { QueryOwnerDto } from "./dto/query-owner.dto";
import { UpdateOwnerDto } from "./dto/update-owner.dto";
import { OwnerService } from "./owner.service";

@ApiTags("owners")
@Controller("owners")
export class OwnerController {
    constructor(private readonly ownerService: OwnerService) {}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "profileImage", maxCount: 1 },
            { name: "coverImage", maxCount: 1 },
        ]),
    )
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string", format: "email" },
                password: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
                about: { type: "string" },
                isAmbassador: { type: "boolean", default: false },
                emailNotify: { type: "boolean", default: true },
                showOwnerInfo: { type: "boolean", default: true },
                profileImage: { type: "string", format: "binary" },
                coverImage: { type: "string", format: "binary" },
            },
            required: ["name", "email", "password", "phone", "profileImage"],
        },
    })
    async create(
        @Body() dto: CreateOwnerDto,
        @UploadedFiles()
        files: {
            profileImage?: Express.Multer.File[];
            coverImage?: Express.Multer.File[];
        },
    ) {
        try {
            const profileImage = files?.profileImage?.[0];
            const coverImage = files?.coverImage?.[0];

            if (!profileImage) throw new BadRequestException("Profile image is required");

            const profileImageId = await this.ownerService.uploadFile(profileImage);
            const coverImageId = coverImage
                ? await this.ownerService.uploadFile(coverImage)
                : undefined;

            return this.ownerService.create({
                ...dto,
                profileImageId,
                coverImageId,
            });
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to create owner");
        }
    }

    @Get()
    @ApiOperation({ summary: "Get all owners" })
    @ApiQuery({ type: QueryOwnerDto })
    async findAll(@Query() query: QueryOwnerDto) {
        try {
            return await this.ownerService.findAll(query);
        } catch (error) {
            throw new BadRequestException(error.message || "Failed to fetch owners");
        }
    }

    @Get(":id")
    @ApiOperation({ summary: "Get owner by id" })
    @ApiParam({ name: "id", description: "Owner ID" })
    async findOne(@Param("id") id: string) {
        try {
            return await this.ownerService.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to fetch owner");
        }
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update owner" })
    @ApiParam({ name: "id", description: "Owner ID" })
    async update(@Param("id") id: string, @Body() dto: UpdateOwnerDto) {
        try {
            return await this.ownerService.update(id, dto);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to update owner");
        }
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete owner" })
    @ApiParam({ name: "id", description: "Owner ID" })
    async remove(@Param("id") id: string) {
        try {
            return await this.ownerService.remove(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(error.message || "Failed to delete owner");
        }
    }
}
