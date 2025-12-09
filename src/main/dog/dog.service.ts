import { PrismaService } from "@common/prisma/prisma.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { S3Service } from "@softvence/s3";
import { CreateDogDto } from "./dto/create-dog.dto";
import { QueryDogDto } from "./dto/query-dog.dto";
import { UpdateDogDto } from "./dto/update-dog.dto";

@Injectable()
export class DogService {
    constructor(
        private prisma: PrismaService,
        private s3: S3Service,
    ) {}

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

    async create(dto: CreateDogDto) {
        try {
            // Check if owner exists
            const owner = await this.prisma.owner.findUnique({
                where: { id: dto.ownerId },
            });
            if (!owner) throw new NotFoundException("Owner not found");

            // Check for duplicate pcrId
            const existingPcr = await this.prisma.dog.findUnique({
                where: { pcrId: dto.pcrId },
            });
            if (existingPcr) throw new ConflictException("PCR ID already exists");

            // Check for duplicate microchip
            const existingMicrochip = await this.prisma.dog.findUnique({
                where: { microchip: dto.microchip },
            });
            if (existingMicrochip) throw new ConflictException("Microchip already registered");

            // Create dog with health and breed analysis
            const dog = await this.prisma.dog.create({
                data: {
                    ownerId: dto.ownerId,
                    pcrId: dto.pcrId,
                    name: dto.name,
                    breed: dto.breed,
                    color: dto.color,
                    sex: dto.sex,
                    microchip: dto.microchip,
                    dateOfBirth: new Date(dto.dateOfBirth),
                    weight: Number(dto.weight),
                    location: dto.location,
                    status: "pending",
                    health: {
                        create: {
                            healthStatus: dto.healthStatus || "Not Reported",
                        },
                    },
                    breedAnalysis: {
                        create: [
                            {
                                breed: dto.breed,
                                percentage:
                                    dto.primaryBreedPercentage !== undefined
                                        ? Number(dto.primaryBreedPercentage)
                                        : 100,
                            },
                            ...(dto.secondaryBreed
                                ? [
                                      {
                                          breed: dto.secondaryBreed,
                                          percentage:
                                              dto.secondaryBreedPercentage !== undefined
                                                  ? Number(dto.secondaryBreedPercentage)
                                                  : 0,
                                      },
                                  ]
                                : []),
                        ],
                    },
                },
                include: {
                    owner: true,
                    health: true,
                    breedAnalysis: true,
                },
            });

            // Persist media files (featured + gallery)
            const mediaIds: string[] = [];
            if (dto.featuredImageId) mediaIds.push(dto.featuredImageId);
            if (dto.mediaImageIds) {
                const parts = dto.mediaImageIds
                    .split(",")
                    .map((p) => p.trim())
                    .filter(Boolean);
                mediaIds.push(...parts);
            }

            if (mediaIds.length > 0) {
                await this.prisma.dogMedia.createMany({
                    data: mediaIds.map((fileId) => ({ dogId: dog.id, fileUrlId: fileId })),
                });
            }

            const dogWithMedia = await this.prisma.dog.findUnique({
                where: { id: dog.id },
                include: {
                    owner: true,
                    health: true,
                    breedAnalysis: true,
                    media: { include: { fileUrl: true } },
                },
            });

            return this.formatDogResponse(dogWithMedia);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create dog: ${error.message}`);
        }
    }

    async findAll(query: QueryDogDto) {
        try {
            const dogs = await this.prisma.dog.findMany({
                where: {
                    ownerId: query.ownerId,
                    status: query.status,
                    breed: query.breed,
                },
                include: {
                    owner: true,
                    health: true,
                    breedAnalysis: true,
                    media: {
                        include: { fileUrl: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            });

            return dogs.map((dog) => this.formatDogResponse(dog));
        } catch (error) {
            throw new Error(`Failed to fetch dogs: ${error.message}`);
        }
    }

    async findOne(id: string) {
        try {
            const dog = await this.prisma.dog.findUnique({
                where: { id },
                include: {
                    owner: {
                        include: {
                            user: { include: { profileImage: true } },
                            coverImage: true,
                        },
                    },
                    health: true,
                    breedAnalysis: true,
                    media: {
                        include: { fileUrl: true },
                    },
                    certificates: true,
                    registrationRequests: true,
                },
            });

            if (!dog) throw new NotFoundException("Dog not found");
            return this.formatDogResponse(dog);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch dog: ${error.message}`);
        }
    }

    async update(id: string, dto: UpdateDogDto) {
        try {
            await this.findOne(id);

            // Check for duplicate microchip if updating
            if (dto.microchip) {
                const existingMicrochip = await this.prisma.dog.findUnique({
                    where: { microchip: dto.microchip },
                });
                if (existingMicrochip && existingMicrochip.id !== id) {
                    throw new ConflictException("Microchip already registered");
                }
            }

            // Check for duplicate pcrId if updating
            if (dto.pcrId) {
                const existingPcr = await this.prisma.dog.findUnique({
                    where: { pcrId: dto.pcrId },
                });
                if (existingPcr && existingPcr.id !== id) {
                    throw new ConflictException("PCR ID already exists");
                }
            }

            const updateData: any = {
                name: dto.name,
                breed: dto.breed,
                color: dto.color,
                sex: dto.sex,
                weight: dto.weight,
                location: dto.location,
            };

            if (dto.microchip) updateData.microchip = dto.microchip;
            if (dto.pcrId) updateData.pcrId = dto.pcrId;
            if (dto.dateOfBirth) updateData.dateOfBirth = new Date(dto.dateOfBirth);

            const dog = await this.prisma.dog.update({
                where: { id },
                data: updateData,
                include: {
                    owner: true,
                    health: true,
                    breedAnalysis: true,
                    media: {
                        include: { fileUrl: true },
                    },
                },
            });

            return this.formatDogResponse(dog);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Failed to update dog: ${error.message}`);
        }
    }

    async remove(id: string) {
        try {
            await this.findOne(id);
            return await this.prisma.dog.delete({ where: { id } });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete dog: ${error.message}`);
        }
    }

    async updateHealth(dogId: string, healthStatus: string) {
        try {
            await this.findOne(dogId);

            return await this.prisma.dogHealth.updateMany({
                where: { dogId },
                data: { healthStatus },
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update health: ${error.message}`);
        }
    }

    async addMedia(dogId: string, fileIds: string[]) {
        try {
            await this.findOne(dogId);

            const mediaRecords = await this.prisma.dogMedia.createMany({
                data: fileIds.map((fileId) => ({
                    dogId,
                    fileUrlId: fileId,
                })),
            });

            return mediaRecords;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to add media: ${error.message}`);
        }
    }

    private formatDogResponse(dog: any) {
        const breedAnalysis = dog.breedAnalysis?.reduce((acc: any, breed: any) => {
            acc[breed.breed.toLowerCase().replace(/\s+/g, "_")] = breed.percentage;
            return acc;
        }, {});

        return {
            ...dog,
            breedAnalysis,
            vaccinations: dog.vaccinations?.split(",").map((v: string) => v.trim()) || [],
            healthClearances: dog.healthClearances?.split(",").map((h: string) => h.trim()) || [],
        };
    }
}
