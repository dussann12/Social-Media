import { Module } from "@nestjs/common"
import { PrismaModule } from "src/prisma/prisma.module"
import { LikeService } from "./like.service"
import { LikeController } from "./like.controller"

@Module({
    imports: [PrismaModule],
    providers: [LikeService],
    controllers: [LikeController],
    exports: [LikeService],
})

export class LikeModule {}