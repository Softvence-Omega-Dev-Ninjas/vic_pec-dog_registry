import { Module } from "@nestjs/common";
import { S3Module } from "@softvence/s3";
import { OwnerController } from "./owner.controller";
import { OwnerService } from "./owner.service";

@Module({
    imports: [S3Module],
    controllers: [OwnerController],
    providers: [OwnerService],
})
export class OwnerModule {}
