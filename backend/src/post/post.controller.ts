import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Post as PostModel } from "@prisma/client";

@UseGuards(JwtAuthGuard)
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post("create")
  async create(
    @Body() postData: { title: string; content?: string },
    @CurrentUser() user: any,
  ): Promise<PostModel> {
    return this.postService.createPost({
      ...postData,
      author: { connect: { id: user.id } },
    });
  }

  @Get()
  async findAll(): Promise<PostModel[]> {
    return this.postService.findAllPosts();
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PostModel | null> {
    return this.postService.findPostById(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() postData: { title?: string; content?: string },
  ): Promise<PostModel> {
    return this.postService.updatePost(id, postData);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<PostModel> {
    return this.postService.deletePost(id);
  }
}