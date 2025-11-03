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
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Post as PostModel } from "@prisma/client";

@UseGuards(JwtAuthGuard)
@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpCode(HttpStatus.CREATED)
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

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<PostModel[]> {
    return this.postService.findAllPosts();
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PostModel | null> {
    return this.postService.findPostById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() postData: { title?: string; content?: string },
  ): Promise<PostModel> {
    return this.postService.updatePost(id, postData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<PostModel> {
    return this.postService.deletePost(id);
  }
}