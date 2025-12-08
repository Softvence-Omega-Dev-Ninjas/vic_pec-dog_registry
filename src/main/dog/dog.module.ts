import { PrismaModule } from "@common/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { S3Module } from "@softvence/s3";
import { DogController } from "./dog.controller";
import { DogService } from "./dog.service";

@Module({
    imports: [PrismaModule, S3Module],
    controllers: [DogController],
    providers: [DogService],
    exports: [DogService],
})
export class DogModule {}
