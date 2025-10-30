import { Controller, Post, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { FriendshipService } from "./friendship.service";

@UseGuards(JwtAuthGuard)
@Controller('friendship')

export class FriendshipController {
    constructor(private readonly friendshipService: FriendshipService) {}

    @UseGuards(JwtAuthGuard)
    @Post('request/:receiverId')
    async sendRequest(
        @CurrentUser() user: any,
        @Param('receiverId') receiverId: string,
    ) {
        return this.friendshipService.sendRequest(user.id, Number(receiverId));
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept/:requestId')
    async acceptRequest(
        @CurrentUser() user: any,
        @Param('requestId') requestId: string,
    ) {
        return this.friendshipService.acceptRequest(Number(requestId), user.id);
    }
    @UseGuards(JwtAuthGuard)
    @Post('decline/:requestId')
    async declineRequest(
        @CurrentUser() user: any,
        @Param('requestId') requestId: string,
    ) {
        return this.friendshipService.declineRequest(Number(requestId), user.id);
    }
    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getFriends(@CurrentUser() user: any)
    {
        return this.friendshipService.getFriends(user.id);
    }
}