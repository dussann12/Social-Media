import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class UploadService{
    constructor(private readonly prisma: PrismaService) {}

    async uploadProfilePicture(userId: number, filePath: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profileImage: filePath
            },
        });
    }

    async uploadPostImage(postId: number, filePath: string) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if(!post) {
            throw new NotFoundException('Post not found');
        }
        return this.prisma.post.update({
            where: {
                id: postId
            },
            data: {
                imageUrl: filePath
            },
        });
    }


}