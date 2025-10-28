import { Controller, Post, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { LikeService } from "./like.service";

@UseGuards(JwtAuthGuard)
@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @Post(':postId')

    async toggleLike(@Param('postId') postId: string, @CurrentUser() user: any) {
        const result = await this.likeService.toggleLike(Number(postId), user.id);

        return {
            liked: result,
            message: result ? 'Post liked successfully' : 'Post unliked successfully',
        };
    }
}