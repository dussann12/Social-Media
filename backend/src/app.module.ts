import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { FriendshipModule } from './friendship/friendship.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, PostModule, LikeModule, CommentModule, FriendshipModule, UploadModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      }
  ]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
