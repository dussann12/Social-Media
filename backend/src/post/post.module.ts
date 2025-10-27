import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";


@Module({
    exports: [PostService],
    controllers: [PostController],
    providers: [PostService],
    imports: [PrismaModule]
})
export class PostModule {}