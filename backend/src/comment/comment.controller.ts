import { Controller, Post, Get, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CommentService } from "./comment.service";

@UseGuards(JwtAuthGuard)
@Controller('comment')

export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post(':postId')
    
    async createComment(@Param('postId') postId: number, @Body('content') content: string, @CurrentUser() user: any ) {
        return this.commentService.createComment(Number(postId), user.id, content);
    }
    @Get(':postId')
    async getCommentsByPost(@Param('postId') postId: number) {
        return this.commentService.getCommentsByPost(Number(postId));
    }
    @Delete('commentId')
    async deleteComment(@Param('commentId') commentId: number, @CurrentUser() user: any) {
        return this.commentService.deleteComment(Number(commentId), user.id);
    }

}
