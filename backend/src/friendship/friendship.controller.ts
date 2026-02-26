import { Controller, Post, Get, Param, UseGuards, HttpCode, HttpStatus, ParseIntPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { FriendshipService } from "./friendship.service";

@UseGuards(JwtAuthGuard)
@Controller('friendship')

export class FriendshipController {
    constructor(private readonly friendshipService: FriendshipService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('request/:receiverId')
    async sendRequest(
        @CurrentUser() user: any,
        @Param('receiverId') receiverId: string,
    ) {
        return this.friendshipService.sendRequest(user.id, Number(receiverId));
    }

    @HttpCode(HttpStatus.OK)
    @Post('accept/:requestId')
    async acceptRequest(
        @CurrentUser() user: any,
        @Param('requestId', ParseIntPipe) requestId: string,
    ) {
        return this.friendshipService.acceptRequest(Number(requestId), user.id);
    }
    @HttpCode(HttpStatus.OK)
    @Post('decline/:requestId')
    async declineRequest(
        @CurrentUser() user: any,
        @Param('requestId', ParseIntPipe) requestId: string,
    ) {
        return this.friendshipService.declineRequest(Number(requestId), user.id);
    }
    @HttpCode(HttpStatus.OK)
    @Get('requests')
    async getPendingRequests(@CurrentUser() user: any) {
        return this.friendshipService.getPendingRequests(user.id);
    }

    @HttpCode(HttpStatus.OK)
    @Get('list')
    async getFriends(@CurrentUser() user: any) {
        return this.friendshipService.getFriends(user.id);
    }
}