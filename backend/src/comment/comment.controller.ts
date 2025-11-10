import { Controller, Post, Get, Delete, Body, Param, UseGuards, HttpStatus, HttpCode, ParseIntPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CommentService } from "./comment.service";

@UseGuards(JwtAuthGuard)
@Controller('comment')

export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post(':postId')
    
    async createComment(@Param('postId', ParseIntPipe) postId: number, @Body('content') content: string, @CurrentUser() user: any ) {
        return this.commentService.createComment(Number(postId), user.id, content);
    }
    @HttpCode(HttpStatus.OK)
    @Get(':postId')
    async getCommentsByPost(@Param('postId') postId: string) {
        return this.commentService.getCommentsByPost(Number(postId));
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':commentId')
    async deleteComment(@Param('commentId') commentId: number, @CurrentUser() user: any) {
        return this.commentService.deleteComment(Number(commentId), user.id);
    }

}
