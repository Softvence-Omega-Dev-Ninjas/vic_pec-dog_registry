import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../../../prisma/generated/client";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    private readonly prisma: PrismaClient;
    private readonly connectionString: string;

    constructor(private readonly configService: ConfigService) {
        this.connectionString = this.configService.getOrThrow<string>("DATABASE_URL");

        const adapter = new PrismaPg({ connectionString: this.connectionString });

        this.prisma = new PrismaClient({
            adapter,
            log: [{ emit: "event", level: "error" }],
        });
    }

    async onModuleInit() {
        this.logger.log("[INIT] Prisma connecting...");
        await this.prisma.$connect();
        this.logger.log("[INIT] Prisma connected");
    }

    async onModuleDestroy() {
        this.logger.log("[DESTROY] Prisma disconnecting...");
        await this.prisma.$disconnect();
        this.logger.log("[DESTROY] Prisma disconnected");
    }

    /** Proxy all Prisma models and methods */
    get client() {
        return this.prisma;
    }

    get user() {
        return this.prisma.user;
    }

    get owner() {
        return this.prisma.owner;
    }

    get fileInstance() {
        return this.prisma.fileInstance;
    }

    get dog() {
        return this.prisma.dog;
    }

    get certificate() {
        return this.prisma.certificate;
    }

    get registrationRequest() {
        return this.prisma.registrationRequest;
    }

    get dogMedia() {
        return this.prisma.dogMedia;
    }

    get dogHealth() {
        return this.prisma.dogHealth;
    }

    get dogBreedAnalysis() {
        return this.prisma.dogBreedAnalysis;
    }

    get report() {
        return this.prisma.report;
    }

    get activityLog() {
        return this.prisma.activityLog;
    }

    get adminSetting() {
        return this.prisma.adminSetting;
    }
}
