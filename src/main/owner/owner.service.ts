import { PrismaService } from "@common/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOwnerDto } from "./dto/create-owner.dto";
import { QueryOwnerDto } from "./dto/query-owner.dto";
import { UpdateOwnerDto } from "./dto/update-owner.dto";

@Injectable()
export class OwnerService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateOwnerDto) {
        return this.prisma.owner.create({
            data: {
                userId: dto.userId,
                ownerCode: dto.ownerCode,
                about: dto.about,
                isAmbassador: dto.isAmbassador,
                emailNotify: dto.emailNotify,
                showOwnerInfo: dto.showOwnerInfo,
                coverImageId: dto.coverImageId,
            },
        });
    }

    private mergeOwnerUser(owner: any) {
        return {
            ...owner.user,
            ...owner,
            user: undefined, // remove nested object
        };
    }

    async findAll(query: QueryOwnerDto) {
        const owners = await this.prisma.owner.findMany({
            where: {
                isAmbassador: query.isAmbassador,
                emailNotify: query.emailNotify,
            },
            include: {
                user: {
                    include: {
                        profileImage: true,
                    },
                },
                coverImage: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return owners.map((o) => this.mergeOwnerUser(o));
    }

    async findOne(id: string) {
        const owner = await this.prisma.owner.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        profileImage: true,
                    },
                },
                coverImage: true,
                dogs: true,
            },
        });

        if (!owner) throw new NotFoundException("Owner not found");

        return this.mergeOwnerUser(owner);
    }

    async update(id: string, dto: UpdateOwnerDto) {
        await this.findOne(id);

        return this.prisma.owner.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.owner.delete({
            where: { id },
        });
    }
}
