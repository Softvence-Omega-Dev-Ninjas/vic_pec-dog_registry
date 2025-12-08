import { PrismaModule } from "@common/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { MailModule } from "@softvence/mail";
import { S3Module } from "@softvence/s3";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MainModule } from "./main/main.module";

@Module({
    imports: [
        MainModule,
        PrismaModule,
        MailModule,
        S3Module.forRoot({
            region: process.env.AWS_REGION!,
            bucket: process.env.AWS_S3_BUCKET_NAME!,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            cache: {
                isCache: true,
                options: {
                    stdTTL: 86400,
                    checkperiod: 120,
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
