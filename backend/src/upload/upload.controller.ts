import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Param, HttpCode, HttpStatus, ParseIntPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { extname } from "path";
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';





@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('profile')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/profile', filename: (req, file, callback) => {
                    const uniqueName = `${uuid()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },

            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
                
            },
            limits: { fileSize: 2 * 1024 * 1024 },
        }),
    )
    async uploadProfilePicture(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: any,
    ) {
        const updated = await this.uploadService.uploadProfilePicture(
            user.id,
            file.path,
        );
        return { message: 'Profile image uploaded successfully', file: updated };
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('posts/:postId')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/posts', 
                filename: (req, file, callback) => {
                    const uniqueName = `${uuid()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
            fileFilter: (req, file, callback) =>
            {
                if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
            },
            limits: { fileSize: 2 * 1024 * 1024 },
        }),
    )
    async uploadPostImage(
        @Param('postId', ParseIntPipe) postId: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const updated = await this.uploadService.uploadPostImage(
            Number(postId),
            file.path,
        );
        return { message: 'Post image uploaded successfully', file: updated };
    }
}