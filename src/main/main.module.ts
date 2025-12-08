import { Module } from "@nestjs/common";
import { DogModule } from "./dog/dog.module";
import { OwnerModule } from "./owner/owner.module";

@Module({
    imports: [OwnerModule, DogModule],
})
export class MainModule {}
