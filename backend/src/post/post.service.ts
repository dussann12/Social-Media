import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, Post } from "@prisma/client";


@Injectable()
export class PostService {
    constructor (private prisma: PrismaService) {}

    async createPost(data: Prisma.PostCreateInput): Promise<Post> {
        return this.prisma.post.create({ data });
    }

    async findAllPosts(): Promise<Post[]> {
        return this.prisma.post.findMany();
    }

    async findPostById(id: number): Promise<Post | null> {
        return this.prisma.post.findUnique({ where: { id } });
    }

    async updatePost(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
        return this.prisma.post.update({ where: { id }, data });
    }

    async deletePost(id: number): Promise<Post> { 
        return this.prisma.post.delete({ where: { id } });
    }
}