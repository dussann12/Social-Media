import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";



@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) {}

    async createComment(postId: number, userId: number, content: string) {
        const existingPost = await this.prisma.post.findUnique ({
            where: {
                id: postId,
            },
        });

        if(!existingPost) { 
            throw new NotFoundException('Post not found');
       
        }
        else {
            const comment = await this.prisma.comment.create ({
                data: { content , user: { connect: { id: userId } }, post: { connect: { id: postId } } }
            })
            return comment
        };
    }

    async getCommentsByPost(postId: number) {
    const existingPost = await this.prisma.post.findUnique ({
            where: {
                id: postId,
            },
        });
        if(!existingPost) { 
            throw new NotFoundException('Post not found');
       
        } else {
            return this.prisma.comment.findMany({

                where: {
                    postId,
                },
                include: {
                    user: true,
                }
            });
        }

    }
    async deleteComment(commentId: number, userId: number) {
        const existingComment = await this.prisma.comment.findUnique ({
            where: {
                id: commentId,
            },
        });
        if(!existingComment) { 
            throw new NotFoundException('Comment not found');
       
        } else if (existingComment.userId !== userId) {
            throw new UnauthorizedException('You can only delete your own comments');


        } else {
             await this.prisma.comment.delete({
                 where: { id: commentId },
             });
             return { message: 'Comment deleted successfully'};
        };

    }

}