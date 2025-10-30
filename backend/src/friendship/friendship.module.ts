import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { FriendshipService } from "./friendship.service";
import { FriendshipController } from "./friendship.controller";

@Module({
    controllers: [FriendshipController],
    providers: [FriendshipService],
    imports: [PrismaModule],
    exports: [FriendshipService],
})

export class FriendshipModule {}
