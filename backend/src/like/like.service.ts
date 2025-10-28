import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class LikeService {
    constructor(private prisma: PrismaService) {}

    async toggleLike(postId: number, userId: number) {
        const existingLike = await this.prisma.like.findUnique ({
              where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingLike) {
            await this.prisma.like.delete({
                where: {
                    userId_postId: {
                    userId,
                    postId,
                },
            },
        });
            return { liked: false, message: 'Like removed successfully' };
        } else {
            await this.prisma.like.create({
                data: {
                    userId,
                    postId,
                },
            });
            return { liked: true, message: 'Post liked successfully' };
        }
    }
}