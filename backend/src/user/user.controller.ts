import { HttpStatus, ParseIntPipe, Patch, UseGuards, HttpCode } from "@nestjs/common";
import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete
} from '@nestjs/common';
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getMe(@CurrentUser() user: any) {
        return this.userService.getUserProfile(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch('update')
    async updateProfile(
        @CurrentUser() user: any,
        @Body() updateData: { name?: string; email?: string; password?: string },
    ) {
        return this.userService.updateUserProfile(user.id, updateData);
    }
    
    @HttpCode(HttpStatus.CREATED)
    @Post()
    createUser (
        @Body()
       data: { email: string; name?: string; password: string },
    ) {
        return this.userService.createUser(data);
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    getAllUsers() {
        return this.userService.getUser();
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.userService.getUserById(+id);
    }

    @HttpCode(HttpStatus.OK)
    @Put(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        data: { email?: string; name?: string; password?: string },
    ) {
        return this.userService.updateUserById(id ,data);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deletesUserById(id);
    }

    
}