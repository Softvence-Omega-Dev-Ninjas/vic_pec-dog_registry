import { PrismaService } from "@common/prisma/prisma.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { S3Service } from "@softvence/s3";
import * as bcrypt from "bcrypt";
import { CreateOwnerDto } from "./dto/create-owner.dto";
import { QueryOwnerDto } from "./dto/query-owner.dto";
import { UpdateOwnerDto } from "./dto/update-owner.dto";

@Injectable()
export class OwnerService {
    constructor(
        private prisma: PrismaService,
        private s3: S3Service,
    ) {}

    private mergeOwnerUser(owner: any) {
        return {
            ...owner.user,
            ...owner,
            user: undefined,
        };
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        try {
            const results = await this.s3.uploadFiles([file]);
            const uploadedFile = results[0];

            const fileRecord = await this.prisma.fileInstance.create({
                data: {
                    filename: uploadedFile.extension
                        ? `${uploadedFile.originalName.split(".")[0]}.${uploadedFile.extension}`
                        : uploadedFile.originalName,
                    originalFilename: uploadedFile.originalName,
                    path: `${uploadedFile.folder}/${uploadedFile.originalName}`,
                    url: uploadedFile.url,
                    fileType: uploadedFile.folder,
                    mimeType: uploadedFile.mimeType,
                    size: uploadedFile.size,
                },
            });

            return fileRecord.id;
        } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
    }

    private async generateOwnerCode(): Promise<string> {
        const count = await this.prisma.owner.count();
        return `PRC-OW-${String(count + 1).padStart(4, "0")}`;
    }

    async create(dto: CreateOwnerDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (existingUser) throw new ConflictException("Email already exists");

            const ownerCode = await this.generateOwnerCode();
            const userType = "OWNER";
            const status = "pending";

            const hashedPassword = await bcrypt.hash(dto.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: hashedPassword,
                    phone: dto.phone,
                    address: dto.address,
                    userType,
                    status,
                    profileImageId: dto.profileImageId,
                },
            });

            const owner = await this.prisma.owner.create({
                data: {
                    userId: user.id,
                    ownerCode,
                    about: dto.about,
                    isAmbassador:
                        typeof dto.isAmbassador === "string"
                            ? dto.isAmbassador === "true"
                            : dto.isAmbassador,
                    emailNotify:
                        typeof dto.emailNotify === "string"
                            ? dto.emailNotify === "true"
                            : dto.emailNotify,
                    showOwnerInfo:
                        typeof dto.showOwnerInfo === "string"
                            ? dto.showOwnerInfo === "true"
                            : dto.showOwnerInfo,
                    coverImageId: dto.coverImageId,
                },
                include: {
                    user: { include: { profileImage: true } },
                    coverImage: true,
                },
            });

            return this.mergeOwnerUser(owner);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create owner: ${error.message}`);
        }
    }

    async findAll(query: QueryOwnerDto) {
        try {
            const owners = await this.prisma.owner.findMany({
                where: {
                    isAmbassador: query.isAmbassador,
                    emailNotify: query.emailNotify,
                },
                include: {
                    user: { include: { profileImage: true } },
                    coverImage: true,
                },
                orderBy: { createdAt: "desc" },
            });

            return owners.map((o) => this.mergeOwnerUser(o));
        } catch (error) {
            throw new Error(`Failed to fetch owners: ${error.message}`);
        }
    }

    async findOne(id: string) {
        try {
            const owner = await this.prisma.owner.findUnique({
                where: { id },
                include: {
                    user: { include: { profileImage: true } },
                    coverImage: true,
                    dogs: true,
                },
            });

            if (!owner) throw new NotFoundException("Owner not found");
            return this.mergeOwnerUser(owner);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch owner: ${error.message}`);
        }
    }

    async update(id: string, dto: UpdateOwnerDto) {
        try {
            await this.findOne(id);
            return await this.prisma.owner.update({
                where: { id },
                data: dto,
                include: {
                    user: { include: { profileImage: true } },
                    coverImage: true,
                },
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update owner: ${error.message}`);
        }
    }

    async remove(id: string) {
        try {
            await this.findOne(id);
            return await this.prisma.owner.delete({ where: { id } });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete owner: ${error.message}`);
        }
    }
}
