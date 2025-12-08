import { PrismaModule } from "@common/prisma/prisma.module";
import { OwnerModule } from "@main/owner/owner.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MainModule } from "./main/main.module";

@Module({
    imports: [MainModule, PrismaModule, OwnerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
